-- =====================================================================
-- RuralEdu: Sample Seed Data for Demonstration & Testing
-- =====================================================================

USE ruraledu_db;

-- 1. Master Catalogs: Resource Types
INSERT INTO resource_types (id, name, code, description) VALUES
(1, 'Textbook', 'TEXTBOOK', 'Standard educational textbooks and reference manuals'),
(2, 'Notes & Summaries', 'NOTES', 'Handwritten or typed revision notes and chapter summaries'),
(3, 'Question Papers', 'QUESTION_PAPER', 'Previous year exam papers, mock tests and sample questions'),
(4, 'Study Material', 'STUDY_MATERIAL', 'Curated guides, worksheets, and formula sheets'),
(5, 'Educational Link', 'EDU_LINK', 'Approved online learning modules, video playlists and lectures'),
(6, 'Other Materials', 'OTHER', 'Other supplementary learning resources')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Master Catalogs: Subjects
INSERT INTO subjects (id, name, code) VALUES
(1, 'Mathematics', 'MATH'),
(2, 'General Science', 'SCI'),
(3, 'Social Studies', 'SST'),
(4, 'English Language', 'ENG'),
(5, 'Hindi', 'HIN'),
(6, 'Physics', 'PHY'),
(7, 'Chemistry', 'CHEM'),
(8, 'Biology', 'BIO'),
(9, 'Computer Science', 'CS'),
(10, 'General Knowledge', 'GK')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Master Catalogs: Class Levels
INSERT INTO class_levels (id, name, standard_order) VALUES
(1, 'Primary (Class 1 - 5)', 1),
(2, 'Upper Primary (Class 6 - 8)', 2),
(3, 'Secondary (Class 9 - 10)', 3),
(4, 'Higher Secondary (Class 11 - 12)', 4),
(5, 'College & Vocational', 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Initial Users
-- BCrypt hash below corresponds to password: "password123"
-- (The Spring Boot backend will also bootstrap the Admin account dynamically if missing)
INSERT INTO users (id, full_name, email, password, phone, role, organization_name, is_active) VALUES
(1, 'System Administrator', 'admin@ruraledu.org', '$2a$10$7zB3cT6e6v1K.OqvD3m2wOz.l3dF5v8d7bV2jM8hN9qY1wZ4vX1pK', '9876543210', 'ADMIN', 'RuralEdu Central Authority', TRUE),
(2, 'Aarav Sharma', 'aarav.student@ruraledu.org', '$2a$10$7zB3cT6e6v1K.OqvD3m2wOz.l3dF5v8d7bV2jM8hN9qY1wZ4vX1pK', '9812345678', 'STUDENT', 'Govt Model High School, Rampur', TRUE),
(3, 'Sunita Verma', 'sunita.donor@ruraledu.org', '$2a$10$7zB3cT6e6v1K.OqvD3m2wOz.l3dF5v8d7bV2jM8hN9qY1wZ4vX1pK', '9871122334', 'DONOR', 'Education for All Foundation', TRUE),
(4, 'Ramesh Kumar', 'ramesh.teacher@ruraledu.org', '$2a$10$7zB3cT6e6v1K.OqvD3m2wOz.l3dF5v8d7bV2jM8hN9qY1wZ4vX1pK', '9822334455', 'TEACHER', 'Zilla Parishad High School, Khed', TRUE),
(5, 'Seva Rural Trust', 'contact@sevatrust.org', '$2a$10$7zB3cT6e6v1K.OqvD3m2wOz.l3dF5v8d7bV2jM8hN9qY1wZ4vX1pK', '9833445566', 'NGO', 'Seva Rural Community Trust', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 5. Sample Resources
INSERT INTO resources (id, title, description, resource_type_id, subject_id, class_level_id, uploaded_by_id, file_path, file_name, file_size, file_type, external_url, status, admin_remarks, reviewed_by_id, reviewed_at) VALUES
(1, 'Class 10 NCERT Mathematics Solved Problems', 'Complete handbook with step-by-step solutions for trigonometry, quadratic equations and geometry.', 1, 1, 3, 3, 'uploads/resources/math_class10_solutions.pdf', 'math_class10_solutions.pdf', 2450000, 'application/pdf', NULL, 'APPROVED', 'Verified and compliant with state curriculum.', 1, NOW()),
(2, 'Basic Physics Formula Sheet for Class 11', 'Handy 4-page formula sheet covering kinematics, laws of motion, gravitation, and thermodynamics.', 2, 6, 4, 4, 'uploads/resources/physics_formulas_class11.pdf', 'physics_formulas_class11.pdf', 850000, 'application/pdf', NULL, 'APPROVED', 'High educational value for science students.', 1, NOW()),
(3, 'Class 8 Science Interactive Video Lessons', 'Curated YouTube playlist aligned with SCERT curriculum explaining plant reproduction and cell structure.', 5, 2, 2, 5, NULL, NULL, NULL, NULL, 'https://www.youtube.com/playlist?list=sample_rural_edu_science', 'APPROVED', 'Approved multimedia link.', 1, NOW()),
(4, 'Secondary English Grammar & Composition Notes', 'Easy explanations of tenses, active/passive voice, direct-indirect speech with exercises in rural context.', 4, 4, 3, 4, 'uploads/resources/english_grammar_notes.pdf', 'english_grammar_notes.pdf', 1200000, 'application/pdf', NULL, 'PENDING', NULL, NULL, NULL),
(5, 'Class 12 Chemistry Previous 5 Years Question Papers', 'Combined PDF of solved Board exam papers from 2019 to 2024 with marking scheme.', 3, 7, 4, 3, 'uploads/resources/chemistry_board_papers.pdf', 'chemistry_board_papers.pdf', 3400000, 'application/pdf', NULL, 'PENDING', NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Sample Resource Requests
INSERT INTO resource_requests (id, requester_id, resource_name, class_level_id, subject_id, resource_type_id, quantity, reason, status, matched_resource_id, admin_remarks, reviewed_by_id) VALUES
(1, 2, 'Class 10 Mathematics Revision Notes', 3, 1, 2, 1, 'Preparing for upcoming pre-board examinations and need concise revision notes for geometry.', 'MATCHED', 1, 'Matched with available Class 10 NCERT Mathematics Solved Problems handbook.', 1),
(2, 4, 'Class 8 Science Practical Workbook', 2, 2, 4, 25, 'Required for 25 rural students in our school science club without access to laboratory kits.', 'PENDING', NULL, NULL, NULL),
(3, 2, 'Class 11 Physics Reference Notes', 4, 6, 2, 1, 'Need reference material for thermodynamics chapter.', 'MATCHED', 2, 'Matched with Physics Formula Sheet.', 1)
ON DUPLICATE KEY UPDATE resource_name=VALUES(resource_name);

-- 7. Sample Donations
INSERT INTO donations (id, donor_id, resource_id, donation_type, description, quantity, status) VALUES
(1, 3, 1, 'DIGITAL_RESOURCE', 'Donated digital textbook solutions for high school mathematics.', 1, 'DISTRIBUTED'),
(2, 3, NULL, 'PHYSICAL_BOOKS', 'Set of 40 physical NCERT science textbooks for rural village library.', 40, 'RECEIVED')
ON DUPLICATE KEY UPDATE description=VALUES(description);

