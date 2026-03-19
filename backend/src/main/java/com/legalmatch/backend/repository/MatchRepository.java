package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByLegalCase_Id(Long caseId);
    List<Match> findByMatchedUser(User user);
    List<Match> findByMatchedUserAndMatchStatus(User user, String status);
}
