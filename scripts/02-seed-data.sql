-- Seed data for Car Service Tracking System

-- Insert default admin user
INSERT INTO users (username, email, password_hash, full_name, user_type) VALUES
('admin', 'admin@carservice.co.tz', '$2b$10$example_hash', 'System Administrator', 'admin'),
('manager', 'manager@carservice.co.tz', '$2b$10$example_hash', 'Office Manager', 'office_manager');

-- Insert service categories
INSERT INTO service_categories (name, description) VALUES
('Car Services', 'General automotive repair and maintenance services'),
('Tyre Services', 'Tyre sales, installation, and maintenance'),
('Consultation', 'Advisory services and inspections');

-- Insert service types
INSERT INTO service_types (category_id, name, description, estimated_duration, base_price) VALUES
(1, 'Oil Change', 'Engine oil and filter replacement', 30, 45000),
(1, 'Brake Service', 'Brake pad and disc inspection/replacement', 90, 120000),
(1, 'Engine Diagnostic', 'Computer diagnostic and troubleshooting', 60, 80000),
(1, 'Transmission Service', 'Transmission fluid change and inspection', 120, 150000),
(2, 'Tyre Installation', 'New tyre mounting and balancing', 45, 25000),
(2, 'Tyre Repair', 'Puncture repair and patching', 20, 15000),
(2, 'Wheel Alignment', 'Front and rear wheel alignment', 60, 35000),
(3, 'Vehicle Inspection', 'Comprehensive vehicle condition assessment', 45, 50000),
(3, 'Service Consultation', 'Advisory on maintenance needs', 30, 30000);

-- Insert inventory categories
INSERT INTO inventory_categories (name, description) VALUES
('Engine Parts', 'Engine components and accessories'),
('Brake Parts', 'Brake system components'),
('Tyres', 'Various tyre brands and sizes'),
('Fluids', 'Engine oils, brake fluids, coolants'),
('Tools', 'Workshop tools and equipment');

-- Insert sample inventory items
INSERT INTO inventory_items (category_id, item_code, name, brand, unit_price, quantity_in_stock, minimum_stock_level) VALUES
(1, 'ENG001', 'Oil Filter', 'Mann Filter', 12000, 50, 10),
(1, 'ENG002', 'Air Filter', 'Bosch', 18000, 30, 5),
(2, 'BRK001', 'Brake Pads Front', 'Brembo', 85000, 20, 5),
(2, 'BRK002', 'Brake Disc', 'ATE', 120000, 15, 3),
(3, 'TYR001', 'Tyre 195/65R15', 'Michelin', 180000, 25, 5),
(3, 'TYR002', 'Tyre 205/55R16', 'Bridgestone', 220000, 20, 5),
(4, 'FLD001', 'Engine Oil 5W-30', 'Castrol', 35000, 40, 10),
(4, 'FLD002', 'Brake Fluid DOT4', 'Bosch', 15000, 25, 5);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('company_name', 'AutoCare Tanzania', 'Company name for invoices and reports'),
('company_address', 'Dar es Salaam, Tanzania', 'Company address'),
('company_phone', '+255 123 456 789', 'Company contact phone'),
('company_email', 'info@autocare.co.tz', 'Company email address'),
('vat_rate', '18.00', 'VAT rate percentage'),
('currency', 'TSH', 'System currency'),
('working_hours_start', '08:00', 'Business opening time'),
('working_hours_end', '18:00', 'Business closing time');
