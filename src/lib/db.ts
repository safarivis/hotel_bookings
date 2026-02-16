import { neon } from '@neondatabase/serverless';

// Get database connection
function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('[DB] No DATABASE_URL configured - booking storage disabled');
    return null;
  }
  return neon(connectionString);
}

// Initialize database tables
export async function initDb() {
  const sql = getDb();
  if (!sql) return;

  try {
    // Customers table
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(100) UNIQUE NOT NULL,
        confirmation_code VARCHAR(100),
        customer_id INTEGER REFERENCES customers(id),
        hotel_id VARCHAR(100) NOT NULL,
        hotel_name VARCHAR(255) NOT NULL,
        room_type VARCHAR(255),
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER DEFAULT 1,
        nights INTEGER DEFAULT 1,
        original_price DECIMAL(10,2),
        markup_price DECIMAL(10,2),
        commission DECIMAL(10,2),
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'confirmed',
        prebook_id VARCHAR(100),
        transaction_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('[DB] Tables initialized');
  } catch (error) {
    console.error('[DB] Init error:', error);
  }
}

// Save or get customer
export async function upsertCustomer(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<number | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const result = await sql`
      INSERT INTO customers (email, first_name, last_name, phone, updated_at)
      VALUES (${data.email}, ${data.firstName}, ${data.lastName}, ${data.phone || null}, CURRENT_TIMESTAMP)
      ON CONFLICT (email)
      DO UPDATE SET
        first_name = ${data.firstName},
        last_name = ${data.lastName},
        phone = COALESCE(${data.phone || null}, customers.phone),
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;
    return result[0]?.id || null;
  } catch (error) {
    console.error('[DB] Customer upsert error:', error);
    return null;
  }
}

// Save booking
export async function saveBooking(data: {
  bookingId: string;
  confirmationCode?: string;
  customerId?: number | null;
  hotelId: string;
  hotelName: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  originalPrice: number;
  markupPrice: number;
  commission: number;
  currency: string;
  status?: string;
  prebookId?: string;
  transactionId?: string;
}): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  try {
    await sql`
      INSERT INTO bookings (
        booking_id, confirmation_code, customer_id, hotel_id, hotel_name,
        room_type, check_in, check_out, guests, nights,
        original_price, markup_price, commission, currency, status,
        prebook_id, transaction_id
      ) VALUES (
        ${data.bookingId}, ${data.confirmationCode || null}, ${data.customerId || null},
        ${data.hotelId}, ${data.hotelName}, ${data.roomType || null},
        ${data.checkIn}, ${data.checkOut}, ${data.guests}, ${data.nights},
        ${data.originalPrice}, ${data.markupPrice}, ${data.commission}, ${data.currency},
        ${data.status || 'confirmed'}, ${data.prebookId || null}, ${data.transactionId || null}
      )
    `;
    console.log('[DB] Booking saved:', data.bookingId);
    return true;
  } catch (error) {
    console.error('[DB] Save booking error:', error);
    return false;
  }
}

// Get booking by ID
export async function getBooking(bookingId: string) {
  const sql = getDb();
  if (!sql) return null;

  try {
    const result = await sql`
      SELECT b.*, c.email, c.first_name, c.last_name, c.phone
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      WHERE b.booking_id = ${bookingId}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Get booking error:', error);
    return null;
  }
}

// Get bookings by customer email
export async function getCustomerBookings(email: string) {
  const sql = getDb();
  if (!sql) return [];

  try {
    const result = await sql`
      SELECT b.*, c.email, c.first_name, c.last_name
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE c.email = ${email}
      ORDER BY b.created_at DESC
    `;
    return result;
  } catch (error) {
    console.error('[DB] Get customer bookings error:', error);
    return [];
  }
}

// Get commission stats
export async function getCommissionStats() {
  const sql = getDb();
  if (!sql) return null;

  try {
    const result = await sql`
      SELECT
        COUNT(*) as total_bookings,
        SUM(commission) as total_commission,
        SUM(markup_price) as total_revenue,
        AVG(commission) as avg_commission
      FROM bookings
      WHERE status = 'confirmed'
    `;
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Get stats error:', error);
    return null;
  }
}
