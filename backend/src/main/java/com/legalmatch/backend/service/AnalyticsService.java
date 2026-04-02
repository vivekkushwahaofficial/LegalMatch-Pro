package com.legalmatch.backend.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.MatchRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import com.legalmatch.backend.repository.UserRepository;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final MatchRepository matchRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;

    public AnalyticsService(UserRepository userRepository,
            CaseRepository caseRepository,
            MatchRepository matchRepository,
            LawyerProfileRepository lawyerProfileRepository,
            NgoProfileRepository ngoProfileRepository) {
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.matchRepository = matchRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.ngoProfileRepository = ngoProfileRepository;
    }

    public Map<String, Object> getOverview() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalUsers", userRepository.count());
        response.put("totalLawyers", lawyerProfileRepository.count());
        response.put("totalNgos", ngoProfileRepository.count());
        response.put("totalCitizens", userRepository.countByRole(Role.CITIZEN));
        response.put("pendingVerifications", userRepository.countByStatus(VerificationStatus.PENDING));
        response.put("approvedVerifications", userRepository.countByStatus(VerificationStatus.APPROVED));
        response.put("totalCases", caseRepository.count());
        response.put("openCases", caseRepository.countByStatusIgnoreCase("OPEN"));
        response.put("matchedCases", caseRepository.countByStatusIgnoreCase("MATCHED"));
        response.put("resolvedCases", caseRepository.countByStatusIgnoreCase("RESOLVED"));
        response.put("totalMatches", matchRepository.count());
        response.put("pendingMatches", matchRepository.countByMatchStatusIgnoreCase("PENDING"));
        response.put("acceptedMatches", matchRepository.countByMatchStatusIgnoreCase("ACCEPTED"));
        response.put("approvedMatches", matchRepository.countByMatchStatusIgnoreCase("APPROVED"));
        response.put("rejectedMatches", matchRepository.countByMatchStatusIgnoreCase("REJECTED"));
        response.put("userGrowthTrend", buildUserGrowthTrend());
        response.put("caseGrowthTrend", buildCaseGrowthTrend());
        response.put("geoCaseDistribution", buildGeoCaseDistribution());
        return response;
    }

    public Map<String, Object> getUserMetrics() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("roles", Map.of(
                "ADMIN", userRepository.countByRole(Role.ADMIN),
                "CITIZEN", userRepository.countByRole(Role.CITIZEN),
                "LAWYER", userRepository.countByRole(Role.LAWYER),
                "NGO", userRepository.countByRole(Role.NGO)
        ));
        response.put("verification", Map.of(
                "PENDING", userRepository.countByStatus(VerificationStatus.PENDING),
                "APPROVED", userRepository.countByStatus(VerificationStatus.APPROVED),
                "REJECTED", userRepository.countByStatus(VerificationStatus.REJECTED)
        ));
        return response;
    }

    public Map<String, Object> getCaseMetrics() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("total", caseRepository.count());
        response.put("byStatus", Map.of(
                "OPEN", caseRepository.countByStatusIgnoreCase("OPEN"),
                "MATCHED", caseRepository.countByStatusIgnoreCase("MATCHED"),
                "RESOLVED", caseRepository.countByStatusIgnoreCase("RESOLVED")
        ));
        return response;
    }

    public Map<String, Object> getMatchMetrics() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("total", matchRepository.count());
        response.put("byStatus", Map.of(
                "PENDING", matchRepository.countByMatchStatusIgnoreCase("PENDING"),
                "REQUESTED", matchRepository.countByMatchStatusIgnoreCase("REQUESTED"),
                "APPROVED", matchRepository.countByMatchStatusIgnoreCase("APPROVED"),
                "ACCEPTED", matchRepository.countByMatchStatusIgnoreCase("ACCEPTED"),
                "REJECTED", matchRepository.countByMatchStatusIgnoreCase("REJECTED")
        ));
        return response;
    }

    public List<Map<String, Object>> getKpiCards() {
        Map<String, Object> overview = getOverview();
        return List.of(
                Map.of("key", "users", "label", "Total Users", "value", overview.get("totalUsers")),
                Map.of("key", "cases", "label", "Total Cases", "value", overview.get("totalCases")),
                Map.of("key", "matches", "label", "Total Matches", "value", overview.get("totalMatches")),
                Map.of("key", "resolved", "label", "Resolved Cases", "value", overview.get("resolvedCases"))
        );
    }

    private List<Map<String, Object>> buildUserGrowthTrend() {
        Map<YearMonth, Long> buckets = initializeMonthBuckets(6);
        for (User user : userRepository.findAll()) {
            LocalDateTime submitted = user.getSubmittedDate();
            if (submitted == null) {
                continue;
            }
            YearMonth month = YearMonth.from(submitted);
            if (buckets.containsKey(month)) {
                buckets.put(month, buckets.get(month) + 1);
            }
        }

        return buckets.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("month", entry.getKey().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                    row.put("count", entry.getValue());
                    return row;
                })
                .toList();
    }

    private List<Map<String, Object>> buildCaseGrowthTrend() {
        Map<YearMonth, Long> buckets = initializeMonthBuckets(6);
        for (Case legalCase : caseRepository.findAll()) {
            LocalDateTime created = legalCase.getCreatedAt();
            if (created == null) {
                continue;
            }
            YearMonth month = YearMonth.from(created);
            if (buckets.containsKey(month)) {
                buckets.put(month, buckets.get(month) + 1);
            }
        }

        return buckets.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("month", entry.getKey().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                    row.put("count", entry.getValue());
                    return row;
                })
                .toList();
    }

    private List<Map<String, Object>> buildGeoCaseDistribution() {
        Map<String, Long> grouped = caseRepository.findAll().stream()
                .map(Case::getLocation)
                .map(location -> {
                    if (location == null || location.trim().isEmpty()) {
                        return "Not Provided";
                    }
                    return location.trim();
                })
                .collect(java.util.stream.Collectors.groupingBy(location -> location, java.util.stream.Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
                .limit(6)
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("location", entry.getKey());
                    row.put("count", entry.getValue());
                    return row;
                })
                .toList();
    }

    private Map<YearMonth, Long> initializeMonthBuckets(int months) {
        Map<YearMonth, Long> buckets = new LinkedHashMap<>();
        YearMonth start = YearMonth.now().minusMonths(months - 1L);
        for (int i = 0; i < months; i++) {
            buckets.put(start.plusMonths(i), 0L);
        }
        return buckets;
    }
}
