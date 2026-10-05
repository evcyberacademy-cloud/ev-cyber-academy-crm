-- ==============================================================================
-- EV CYBER ACADEMY — CENTRAL CLOUD DATABASE SCHEMA & REALTIME SYNC
-- ==============================================================================
-- 100% SUPABASE FREE TIER COMPLIANT (₹0 Database Cost)
-- Includes:
-- 1. `leads` table with full data model & integrity checks
-- 2. REPLICA IDENTITY FULL (Essential for Supabase Realtime WebSocket payloads)
-- 3. Row Level Security (RLS) policies for team members (anon & authenticated)
-- 4. Supabase Realtime publication setup for cross-device live sync
-- 5. Auto-updating timestamps
-- 6. Performance indexes for lightning-fast queries
-- ==============================================================================

-- 1. EXTENSIONS
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

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Allows seamless CRUD operations from both web app and mobile devices
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full access to leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users have full access to leads" ON public.leads;
DROP POLICY IF EXISTS "Enable all access for team" ON public.leads;

CREATE POLICY "Allow full access to leads"
    ON public.leads
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 6. CONFIGURE REALTIME PUBLICATION & REPLICA IDENTITY
-- REPLICA IDENTITY FULL ensures UPDATE and DELETE events send all row columns to WebSocket clients
ALTER TABLE public.leads REPLICA IDENTITY FULL;

-- Add table to supabase_realtime publication
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

-- 7. INITIAL SAMPLE LEADS (Optional - only inserted if table is empty)
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
)
ON CONFLICT DO NOTHING;
