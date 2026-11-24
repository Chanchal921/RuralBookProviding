package com.ruraledu.config;

import com.ruraledu.entity.ClassLevel;
import com.ruraledu.entity.Donation;
import com.ruraledu.entity.Resource;
import com.ruraledu.entity.ResourceRequest;
import com.ruraledu.entity.ResourceType;
import com.ruraledu.entity.Subject;
import com.ruraledu.entity.User;
import com.ruraledu.enums.DonationStatus;
import com.ruraledu.enums.DonationType;
import com.ruraledu.enums.RequestStatus;
import com.ruraledu.enums.ResourceStatus;
import com.ruraledu.enums.Role;
import com.ruraledu.repository.ClassLevelRepository;
import com.ruraledu.repository.DonationRepository;
import com.ruraledu.repository.ResourceRepository;
import com.ruraledu.repository.ResourceRequestRepository;
import com.ruraledu.repository.ResourceTypeRepository;
import com.ruraledu.repository.SubjectRepository;
import com.ruraledu.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ResourceTypeRepository resourceTypeRepository;
    private final SubjectRepository subjectRepository;
    private final ClassLevelRepository classLevelRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository requestRepository;
    private final DonationRepository donationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email:admin@ruraledu.org}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.bootstrap.admin.name:RuralEdu Administrator}")
    private String adminName;

    @Value("${app.bootstrap.admin.organization:RuralEdu Foundation}")
    private String adminOrg;

    public DataInitializer(UserRepository userRepository,
                           ResourceTypeRepository resourceTypeRepository,
                           SubjectRepository subjectRepository,
                           ClassLevelRepository classLevelRepository,
                           ResourceRepository resourceRepository,
                           ResourceRequestRepository requestRepository,
                           DonationRepository donationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.resourceTypeRepository = resourceTypeRepository;
        this.subjectRepository = subjectRepository;
        this.classLevelRepository = classLevelRepository;
        this.resourceRepository = resourceRepository;
        this.requestRepository = requestRepository;
        this.donationRepository = donationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedMasterData();
        seedUsers();
        seedSampleResourcesAndRequests();
        log.info("RuralEdu Data Initialization successfully completed.");
    }

    private void seedMasterData() {
        if (resourceTypeRepository.count() == 0) {
            resourceTypeRepository.save(new ResourceType("Textbook", "TEXTBOOK", "Standard educational textbooks and reference manuals"));
            resourceTypeRepository.save(new ResourceType("Notes & Summaries", "NOTES", "Handwritten or typed revision notes and chapter summaries"));
            resourceTypeRepository.save(new ResourceType("Question Papers", "QUESTION_PAPER", "Previous year exam papers, mock tests and sample questions"));
            resourceTypeRepository.save(new ResourceType("Study Material", "STUDY_MATERIAL", "Curated guides, worksheets, and formula sheets"));
            resourceTypeRepository.save(new ResourceType("Educational Link", "EDU_LINK", "Approved online learning modules, video playlists and lectures"));
            resourceTypeRepository.save(new ResourceType("Other Materials", "OTHER", "Other supplementary learning resources"));
            log.info("Seeded ResourceTypes master catalog.");
        }

        if (subjectRepository.count() == 0) {
            subjectRepository.save(new Subject("Mathematics", "MATH"));
            subjectRepository.save(new Subject("General Science", "SCI"));
            subjectRepository.save(new Subject("Social Studies", "SST"));
            subjectRepository.save(new Subject("English Language", "ENG"));
            subjectRepository.save(new Subject("Hindi", "HIN"));
            subjectRepository.save(new Subject("Physics", "PHY"));
            subjectRepository.save(new Subject("Chemistry", "CHEM"));
            subjectRepository.save(new Subject("Biology", "BIO"));
            subjectRepository.save(new Subject("Computer Science", "CS"));
            subjectRepository.save(new Subject("General Knowledge", "GK"));
            log.info("Seeded Subjects master catalog.");
        }

        if (classLevelRepository.count() == 0) {
            classLevelRepository.save(new ClassLevel("Primary (Class 1 - 5)", 1));
            classLevelRepository.save(new ClassLevel("Upper Primary (Class 6 - 8)", 2));
            classLevelRepository.save(new ClassLevel("Secondary (Class 9 - 10)", 3));
            classLevelRepository.save(new ClassLevel("Higher Secondary (Class 11 - 12)", 4));
            classLevelRepository.save(new ClassLevel("College & Vocational", 5));
            log.info("Seeded ClassLevels master catalog.");
        }
    }

    private void seedUsers() {
        // Admin
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(adminName, adminEmail, passwordEncoder.encode(adminPassword), Role.ADMIN, "9876543210", adminOrg);
            userRepository.save(admin);
            log.info("Admin account initialized: {}", adminEmail);
        }

        // Demo Student
        String studentEmail = "aarav.student@ruraledu.org";
        if (!userRepository.existsByEmail(studentEmail)) {
            User student = new User("Aarav Sharma", studentEmail, passwordEncoder.encode("password123"), Role.STUDENT, "9812345678", "Govt Model High School, Rampur");
            userRepository.save(student);
        }

        // Demo Donor
        String donorEmail = "sunita.donor@ruraledu.org";
        if (!userRepository.existsByEmail(donorEmail)) {
            User donor = new User("Sunita Verma", donorEmail, passwordEncoder.encode("password123"), Role.DONOR, "9871122334", "Education for All Foundation");
            userRepository.save(donor);
        }

        // Demo Teacher
        String teacherEmail = "ramesh.teacher@ruraledu.org";
        if (!userRepository.existsByEmail(teacherEmail)) {
            User teacher = new User("Ramesh Kumar", teacherEmail, passwordEncoder.encode("password123"), Role.TEACHER, "9822334455", "Zilla Parishad High School, Khed");
            userRepository.save(teacher);
        }

        // Demo NGO
        String ngoEmail = "contact@sevatrust.org";
        if (!userRepository.existsByEmail(ngoEmail)) {
            User ngo = new User("Seva Rural Trust", ngoEmail, passwordEncoder.encode("password123"), Role.NGO, "9833445566", "Seva Rural Community Trust");
            userRepository.save(ngo);
        }
    }

    private void seedSampleResourcesAndRequests() {
        if (resourceRepository.count() == 0) {
            User admin = userRepository.findByEmail(adminEmail).orElse(null);
            User donor = userRepository.findByEmail("sunita.donor@ruraledu.org").orElse(null);
            User teacher = userRepository.findByEmail("ramesh.teacher@ruraledu.org").orElse(null);
            User ngo = userRepository.findByEmail("contact@sevatrust.org").orElse(null);
            User student = userRepository.findByEmail("aarav.student@ruraledu.org").orElse(null);

            ResourceType textbook = resourceTypeRepository.findByCode("TEXTBOOK").orElse(null);
            ResourceType notes = resourceTypeRepository.findByCode("NOTES").orElse(null);
            ResourceType questionPaper = resourceTypeRepository.findByCode("QUESTION_PAPER").orElse(null);
            ResourceType eduLink = resourceTypeRepository.findByCode("EDU_LINK").orElse(null);

            Subject math = subjectRepository.findByCode("MATH").orElse(null);
            Subject sci = subjectRepository.findByCode("SCI").orElse(null);
            Subject phy = subjectRepository.findByCode("PHY").orElse(null);
            Subject eng = subjectRepository.findByCode("ENG").orElse(null);

            ClassLevel secondary = classLevelRepository.findByName("Secondary (Class 9 - 10)").orElse(null);
            ClassLevel higherSecondary = classLevelRepository.findByName("Higher Secondary (Class 11 - 12)").orElse(null);
            ClassLevel upperPrimary = classLevelRepository.findByName("Upper Primary (Class 6 - 8)").orElse(null);

            if (donor != null && textbook != null && math != null && secondary != null) {
                Resource r1 = new Resource();
                r1.setTitle("Class 10 NCERT Mathematics Solved Problems");
                r1.setDescription("Complete handbook with step-by-step solutions for trigonometry, quadratic equations and geometry.");
                r1.setResourceType(textbook);
                r1.setSubject(math);
                r1.setClassLevel(secondary);
                r1.setUploadedBy(donor);
                r1.setFileName("math_class10_solutions.pdf");
                r1.setFileSize(2450000L);
                r1.setFileType("application/pdf");
                r1.setStatus(ResourceStatus.APPROVED);
                r1.setAdminRemarks("Verified and compliant with state curriculum.");
                r1.setReviewedBy(admin);
                r1.setReviewedAt(LocalDateTime.now().minusDays(2));
                resourceRepository.save(r1);

                // Create a request matched to r1
                if (student != null) {
                    ResourceRequest req1 = new ResourceRequest();
                    req1.setRequester(student);
                    req1.setResourceName("Class 10 Mathematics Revision Notes");
                    req1.setClassLevel(secondary);
                    req1.setSubject(math);
                    req1.setResourceType(notes != null ? notes : textbook);
                    req1.setQuantity(1);
                    req1.setReason("Preparing for upcoming pre-board examinations and need concise revision notes for geometry.");
                    req1.setStatus(RequestStatus.MATCHED);
                    req1.setMatchedResource(r1);
                    req1.setAdminRemarks("Matched with available Class 10 NCERT Mathematics Solved Problems handbook.");
                    req1.setReviewedBy(admin);
                    requestRepository.save(req1);
                }

                // Donation record
                Donation d1 = new Donation(donor, r1, DonationType.DIGITAL_RESOURCE, "Donated digital textbook solutions for high school mathematics.", 1);
                d1.setStatus(DonationStatus.DISTRIBUTED);
                donationRepository.save(d1);
            }

            if (teacher != null && notes != null && phy != null && higherSecondary != null) {
                Resource r2 = new Resource();
                r2.setTitle("Basic Physics Formula Sheet for Class 11");
                r2.setDescription("Handy 4-page formula sheet covering kinematics, laws of motion, gravitation, and thermodynamics.");
                r2.setResourceType(notes);
                r2.setSubject(phy);
                r2.setClassLevel(higherSecondary);
                r2.setUploadedBy(teacher);
                r2.setFileName("physics_formulas_class11.pdf");
                r2.setFileSize(850000L);
                r2.setFileType("application/pdf");
                r2.setStatus(ResourceStatus.APPROVED);
                r2.setAdminRemarks("High educational value for science students.");
                r2.setReviewedBy(admin);
                r2.setReviewedAt(LocalDateTime.now().minusDays(1));
                resourceRepository.save(r2);
            }

            if (ngo != null && eduLink != null && sci != null && upperPrimary != null) {
                Resource r3 = new Resource();
                r3.setTitle("Class 8 Science Interactive Video Lessons");
                r3.setDescription("Curated YouTube playlist aligned with SCERT curriculum explaining plant reproduction and cell structure.");
                r3.setResourceType(eduLink);
                r3.setSubject(sci);
                r3.setClassLevel(upperPrimary);
                r3.setUploadedBy(ngo);
                r3.setExternalUrl("https://www.youtube.com/playlist?list=sample_rural_edu_science");
                r3.setStatus(ResourceStatus.APPROVED);
                r3.setAdminRemarks("Approved multimedia link for classroom projection.");
                r3.setReviewedBy(admin);
                r3.setReviewedAt(LocalDateTime.now().minusHours(12));
                resourceRepository.save(r3);
            }

            // Pending resources for Admin verification demo
            if (teacher != null && textbook != null && eng != null && secondary != null) {
                Resource r4 = new Resource();
                r4.setTitle("Secondary English Grammar & Composition Notes");
                r4.setDescription("Easy explanations of tenses, active/passive voice, direct-indirect speech with exercises in rural context.");
                r4.setResourceType(textbook);
                r4.setSubject(eng);
                r4.setClassLevel(secondary);
                r4.setUploadedBy(teacher);
                r4.setFileName("english_grammar_notes.pdf");
                r4.setFileSize(1200000L);
                r4.setFileType("application/pdf");
                r4.setStatus(ResourceStatus.PENDING);
                resourceRepository.save(r4);
            }

            // Pending request demo
            if (teacher != null && sci != null && upperPrimary != null && textbook != null) {
                ResourceRequest req2 = new ResourceRequest();
                req2.setRequester(teacher);
                req2.setResourceName("Class 8 Science Practical Workbook");
                req2.setClassLevel(upperPrimary);
                req2.setSubject(sci);
                req2.setResourceType(textbook);
                req2.setQuantity(25);
                req2.setReason("Required for 25 rural students in our school science club without access to laboratory kits.");
                req2.setStatus(RequestStatus.PENDING);
                requestRepository.save(req2);
            }
        }
    }
}

