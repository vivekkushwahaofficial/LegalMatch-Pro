package com.legalmatch.backend.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.User;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByLegalCase_Id(Long caseId);

    List<Match> findByMatchedUser(User user);

    List<Match> findByMatchedUserAndMatchStatus(User user, String status);

    List<Match> findByMatchedUserAndMatchStatusIn(User user, Collection<String> statuses);

    List<Match> findByLegalCase_User(User user);

    Optional<Match> findByMatchIdAndMatchedUser(Long matchId, User matchedUser);

    long countByMatchedUserAndMatchStatusIn(User matchedUser, Collection<String> statuses);

    long countByMatchStatusIgnoreCase(String matchStatus);
}
