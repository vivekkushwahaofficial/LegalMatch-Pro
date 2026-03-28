package com.legalmatch.backend.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.legalmatch.backend.entity.LawyerDirectory;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoDirectory;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;
import com.legalmatch.backend.repository.LawyerDirectoryRepository;
import com.legalmatch.backend.repository.NgoDirectoryRepository;
import com.legalmatch.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final LawyerDirectoryRepository lawyerDirRepo;
    private final NgoDirectoryRepository ngoDirRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(LawyerDirectoryRepository lawyerDirRepo,
            NgoDirectoryRepository ngoDirRepo,
            UserRepository userRepo,
            PasswordEncoder passwordEncoder) {
        this.lawyerDirRepo = lawyerDirRepo;
        this.ngoDirRepo = ngoDirRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("DataInitializer started.");

        boolean missingProviders = userRepo.countByRole(Role.LAWYER) == 0 || userRepo.countByRole(Role.NGO) == 0;
        if (lawyerDirRepo.count() == 0 || userRepo.count() < 5 || missingProviders) {
            log.info("Directories/Users are empty. Seeding full sample data...");
            seedUsersAndDirectories();
        }

        log.info("DataInitializer finished.");
    }

    private void seedUsersAndDirectories() {
        String[][] lawyerData = {
            {"Adv. Rajesh Sharma", "rajesh@example.com", "Mumbai", "Family Law"},
            {"Adv. Priya Mehta", "priya@example.com", "Delhi", "Criminal Law"},
            {"Adv. Suresh Patel", "suresh@example.com", "Bangalore", "Property Law"},
            {"Adv. Ananya Iyer", "ananya@example.com", "Chennai", "Corporate Law"},
            {"Adv. Vikram Singh", "vikram@example.com", "Pune", "Civil Law"},
            {"Adv. Neha Deshmukh", "neha@example.com", "Nanded", "Family Law"},
            {"Adv. Arjun Kapoor", "arjun@example.com", "Hyderabad", "Criminal Law"},
            {"Adv. Kavita Roy", "kavita@example.com", "Kolkata", "Consumer Protection"},};

        for (String[] row : lawyerData) {
            // Seed Directory
            LawyerDirectory l = new LawyerDirectory();
            l.setName(row[0]);
            l.setLocation(row[2].toUpperCase());
            l.setExpertise(row[3]);
            l.setVerified(true);
            l.setOrganizationDetails("Sample Seed Data");
            lawyerDirRepo.save(l);

            // Seed User Profile for Matching
            if (userRepo.findByEmail(row[1]).isEmpty()) {
                User u = new User();
                u.setName(row[0]);
                u.setEmail(row[1]);
                u.setPassword(passwordEncoder.encode("password123"));
                u.setRole(Role.LAWYER);
                u.setStatus(VerificationStatus.APPROVED);
                u.setSubmittedDate(LocalDateTime.now());

                LawyerProfile p = new LawyerProfile();
                p.setSpecialization(row[3]);
                p.setLocation(row[2].toUpperCase());
                p.setLicenseNumber("BAR/" + System.currentTimeMillis());
                p.setVerified(true);
                p.setUser(u);
                u.setLawyerProfile(p);
                userRepo.save(u);
            }
        }

        String[][] ngoData = {
            {"Legal Aid Foundation", "legalaid@example.com", "Mumbai", "Family Law"},
            {"Justice For All", "justice@example.com", "Delhi", "Criminal Law"},
            {"Women's Rights Initiative", "womensrights@example.com", "Bangalore", "Women's Rights"},
            {"Human Rights Watch", "hrw@example.com", "Chennai", "Human Rights"},
            {"Rural Legal Aid", "rural@example.com", "Nanded", "Property Law"},
            {"Anti-Corruption NGO", "antic@example.com", "Hyderabad", "Anti-Corruption"},};

        for (String[] row : ngoData) {
            // Seed Directory
            NgoDirectory n = new NgoDirectory();
            n.setName(row[0]);
            n.setLocation(row[2].toUpperCase());
            n.setExpertise(row[3]);
            n.setVerified(true);
            n.setOrganizationDetails("Sample Seed Data");
            ngoDirRepo.save(n);

            // Seed User Profile for Matching
            if (userRepo.findByEmail(row[1]).isEmpty()) {
                User u = new User();
                u.setName(row[0]);
                u.setEmail(row[1]);
                u.setPassword(passwordEncoder.encode("password123"));
                u.setRole(Role.NGO);
                u.setStatus(VerificationStatus.APPROVED);
                u.setSubmittedDate(LocalDateTime.now());

                NgoProfile p = new NgoProfile();
                p.setNgoName(row[0]);
                p.setSpecialization(row[3]);
                p.setLocation(row[2].toUpperCase());
                p.setRegistrationNumber("NGO/" + System.currentTimeMillis());
                p.setVerified(true);
                p.setUser(u);
                u.setNgoProfile(p);
                userRepo.save(u);
            }
        }
    }
}
