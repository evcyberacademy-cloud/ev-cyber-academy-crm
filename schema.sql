-- ==============================================================================
-- EV CYBER ACADEMY — LEAD MANAGEMENT SYSTEM DATABASE SCHEMA
-- ==============================================================================
-- 100% SUPABASE FREE TIER OPTIMIZED (₹0 Cost Database)
-- Includes:
-- 1. `leads` table with complete data model & validation
-- 2. Performance indexes for fast querying & low compute usage
-- 3. Row Level Security (RLS) policies for authenticated staff
-- 4. Supabase Realtime publication setup for cross-device live sync
-- 5. Auto-updating timestamps
-- 6. Initial sample demo leads for testing
-- ==============================================================================

-- 1. CREATE EXTENSIONS (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    interested_program TEXT NOT NULL,
    custom_program TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (
        status IN ('New', 'Contacted', 'Follow-up', 'Interested', 'Converted', 'Not Converted', 'Not Responding')
    ),
    source TEXT NOT NULL DEFAULT 'Website',
    custom_source TEXT,
    notes TEXT,
    next_followup_date DATE,
    followup_note TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (paid_amount >= 0),
    payment_note TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. AUTO-UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;
CREATE TRIGGER set_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. HIGH-PERFORMANCE FREE-TIER INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status) WHERE is_archived = FALSE;
CREATE INDEX IF NOT EXISTS idx_leads_followup ON public.leads(next_followup_date) WHERE is_archived = FALSE;
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_archived ON public.leads(is_archived);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (EV Cyber Academy team members) full read/write access
DROP POLICY IF EXISTS "Authenticated users have full access to leads" ON public.leads;
CREATE POLICY "Authenticated users have full access to leads"
    ON public.leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. ENABLE SUPABASE REALTIME
-- This enables instant bi-directional synchronization across Laptop & Mobile devices
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'leads'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
    END IF;
END $$;

-- 7. OPTIONAL: SAMPLE SEED DATA FOR EV CYBER ACADEMY TESTING
INSERT INTO public.leads (
    full_name, phone, email, interested_program, status, source, notes, 
    next_followup_date, followup_note, total_amount, paid_amount, payment_note
) VALUES
(
    'Rahul Sharma', 
    '+91 98765 43210', 
    'rahul.sharma@example.com', 
    'LFHP', 
    'New', 
    'Instagram', 
    'Enquired about the Live Forensics & Threat Hunting Program batch timings.', 
    CURRENT_DATE, 
    'Call morning 11 AM regarding weekend batch syllabus', 
    15000, 
    0, 
    'Fee quotation sent via WhatsApp'
),
(
    'Pooja Patel', 
    '+91 98123 45678', 
    'pooja.p@example.com', 
    'LWAP', 
    'Follow-up', 
    'WhatsApp', 
    'Looking for Web Application Penetration Testing roadmap and lab access.', 
    CURRENT_DATE, 
    'Send recorded demo session and discount code', 
    12000, 
    2000, 
    'Token amount of ₹2,000 paid via UPI. Remaining ₹10,000 on batch start.'
),
(
    'Amit Verma', 
    '+91 97234 56789', 
    'amit.verma@gmail.com', 
    'LFHP Mini', 
    'Interested', 
    'Webinar', 
    'Attended Sunday Cyber Threat Intelligence Masterclass.', 
    CURRENT_DATE + INTERVAL '1 day', 
    'Follow up after salary date (10th of the month)', 
    7500, 
    0, 
    'Awaiting confirmation'
),
(
    'Vikram Singh', 
    '+91 98345 67890', 
    'vikram.s@outlook.com', 
    'AI Cyber Tool Building Workshop', 
    'Converted', 
    'Website', 
    'Completed full enrollment for AI Cyber Tools Workshop.', 
    NULL, 
    'Student onboarded to Discord and LMS.', 
    4999, 
    4999, 
    'Full payment received ₹4,999. Invoice #EV-2026-104 sent.'
),
(
    'Sneha Joshi', 
    '+91 98456 78901', 
    'sneha.j@techmail.com', 
    'Internship', 
    'Contacted', 
    'Referral', 
    'Referred by Alumni Kunal for 3-Month Cyber Security Internship.', 
    CURRENT_DATE - INTERVAL '1 day', 
    'Interview scheduled. Need to confirm timing.', 
    10000, 
    0, 
    'Pending interview evaluation'
),
(
    'Arjun Nair', 
    '+91 98901 23456', 
    'arjun.nair@corp.in', 
    'Custom', 
    'Not Converted', 
    'Direct', 
    'Wanted offline classroom training in Bengaluru. We currently provide live online.', 
    NULL, 
    'Not converted due to location preference. Keep on newsletter.', 
    0, 
    0, 
    'No commercial transaction'
),
(
    'Meera Reddy', 
    '+91 98712 34567', 
    'meera.reddy@yahoo.com', 
    'LFHP', 
    'Converted', 
    'YouTube', 
    'Enrolled after watching EV Cyber Academy Malware Analysis series.', 
    NULL, 
    'Course access active', 
    15000, 
    7500, 
    '1st installment of ₹7,500 paid. 2nd installment due in 30 days.'
),
(
    'Karan Malhotra', 
    '+91 99123 78901', 
    'karan.m@rediffmail.com', 
    'LWAP', 
    'Not Responding', 
    'Advertisement', 
    'Filled Google Lead Ad form. Called 3 times, phone switched off.', 
    CURRENT_DATE + INTERVAL '3 days', 
    'Try WhatsApp message reminder before closing lead.', 
    12000, 
    0, 
    'No payment'
)
ON CONFLICT DO NOTHING;
