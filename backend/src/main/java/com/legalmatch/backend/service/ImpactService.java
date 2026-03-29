package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.ImpactLog;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.ImpactLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImpactService {

    private final ImpactLogRepository impactLogRepository;

    public ImpactService(ImpactLogRepository impactLogRepository) {
        this.impactLogRepository = impactLogRepository;
    }

    @Transactional
    public void logCaseTaken(User provider) {
        ImpactLog log = impactLogRepository.findByProviderId(provider.getId())
                .orElseGet(() -> {
                    ImpactLog newLog = new ImpactLog();
                    newLog.setProvider(provider);
                    return newLog;
                });
        log.setCasesTaken(log.getCasesTaken() + 1);
        log.setLastUpdated(LocalDateTime.now());
        impactLogRepository.save(log);
    }

    @Transactional
    public void logCaseResolved(User provider) {
        ImpactLog log = impactLogRepository.findByProviderId(provider.getId())
                .orElseGet(() -> {
                    ImpactLog newLog = new ImpactLog();
                    newLog.setProvider(provider);
                    return newLog;
                });
        log.setCasesResolved(log.getCasesResolved() + 1);
        log.setLastUpdated(LocalDateTime.now());
        impactLogRepository.save(log);
    }

    public List<ImpactLog> getAllImpactLogs() {
        return impactLogRepository.findAll();
    }
}
