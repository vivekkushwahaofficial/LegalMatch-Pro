package com.legalmatch.backend.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.legalmatch.backend.dto.ExternalLawyerDto;
import com.legalmatch.backend.dto.ExternalNgoDto;
import com.legalmatch.backend.entity.LawyerDirectory;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoDirectory;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.repository.LawyerDirectoryRepository;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoDirectoryRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;

@Service
public class DirectoryService {

    private static final Logger log = LoggerFactory.getLogger(DirectoryService.class);

    private final LawyerDirectoryRepository lawyerDirectoryRepository;
    private final NgoDirectoryRepository ngoDirectoryRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final RestTemplate restTemplate;

    public DirectoryService(LawyerDirectoryRepository lawyerDirectoryRepository,
            NgoDirectoryRepository ngoDirectoryRepository,
            LawyerProfileRepository lawyerProfileRepository,
            NgoProfileRepository ngoProfileRepository,
            RestTemplate restTemplate) {
        this.lawyerDirectoryRepository = lawyerDirectoryRepository;
        this.ngoDirectoryRepository = ngoDirectoryRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.ngoProfileRepository = ngoProfileRepository;
        this.restTemplate = restTemplate;
    }

    public Page<LawyerProfile> getLawyers(int page, int size) {
        return lawyerProfileRepository.findAll(PageRequest.of(page, size));
    }

    public List<LawyerProfile> searchLawyers(String specialization, String location) {
        return searchLawyers(specialization, location, null);
    }

    public List<LawyerProfile> searchLawyers(String specialization, String location, Boolean verified) {
        if (specialization != null && location != null) {
            List<LawyerProfile> results = lawyerProfileRepository.findBySpecializationIgnoreCaseAndLocationIgnoreCase(specialization, location);
            return filterLawyersByVerified(results, verified);
        } else if (specialization != null) {
            List<LawyerProfile> results = lawyerProfileRepository.findBySpecializationIgnoreCase(specialization);
            return filterLawyersByVerified(results, verified);
        } else if (location != null) {
            List<LawyerProfile> results = lawyerProfileRepository.findByLocationIgnoreCase(location);
            return filterLawyersByVerified(results, verified);
        }
        return filterLawyersByVerified(lawyerProfileRepository.findAll(), verified);
    }

    public List<NgoProfile> getNgos(String location) {
        return getNgos(location, null);
    }

    public List<NgoProfile> getNgos(String location, Boolean verified) {
        if (location != null) {
            List<NgoProfile> results = ngoProfileRepository.findByLocationIgnoreCase(location);
            return filterNgosByVerified(results, verified);
        }
        return filterNgosByVerified(ngoProfileRepository.findAll(), verified);
    }

    public List<LawyerDirectory> getAllDirectoryLawyers() {
        return lawyerDirectoryRepository.findAll();
    }

    public List<NgoDirectory> getAllDirectoryNgos() {
        return ngoDirectoryRepository.findAll();
    }

    public void importLawyersFromExternalApi() {
        String url = "https://api.example.com/lawyers";
        try {
            ResponseEntity<ExternalLawyerDto[]> response = restTemplate.getForEntity(url, ExternalLawyerDto[].class);
            ExternalLawyerDto[] externalLawyers = response.getBody();

            if (externalLawyers != null) {
                for (ExternalLawyerDto dto : externalLawyers) {
                    if (dto.getName() == null || dto.getCity() == null) {
                        continue;
                    }
                    String normalizedLocation = dto.getCity().trim().toUpperCase();
                    if (!lawyerDirectoryRepository.existsByNameAndLocation(dto.getName().trim(), normalizedLocation)) {
                        LawyerDirectory lawyer = new LawyerDirectory();
                        lawyer.setName(dto.getName().trim());
                        lawyer.setExpertise(dto.getPracticeArea());
                        lawyer.setLocation(normalizedLocation);
                        lawyer.setVerified("Verified".equalsIgnoreCase(dto.getVerificationStatus()));
                        lawyer.setOrganizationDetails("Imported from External API");
                        lawyerDirectoryRepository.save(lawyer);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to import lawyers from external API: {}", e.getMessage());
        }
    }

    public void importNgosFromExcel() {
        try {
            List<ExternalNgoDto> externalNgos = readNgosFromExcel("ngo_data.xlsx");
            for (ExternalNgoDto dto : externalNgos) {
                if (dto.getOrg_name() == null || dto.getCity() == null) {
                    continue;
                }
                String normalizedLocation = dto.getCity().trim().toUpperCase();
                if (!ngoDirectoryRepository.existsByNameAndLocation(dto.getOrg_name().trim(), normalizedLocation)) {
                    NgoDirectory ngo = new NgoDirectory();
                    ngo.setName(dto.getOrg_name().trim());
                    ngo.setExpertise(dto.getFocus_area());
                    ngo.setLocation(normalizedLocation);
                    ngo.setVerified("Registered".equalsIgnoreCase(dto.getRegistration_status()));
                    ngo.setOrganizationDetails("Imported from Excel");
                    ngoDirectoryRepository.save(ngo);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to import NGOs from Excel: {}", e.getMessage());
        }
    }

    private List<ExternalNgoDto> readNgosFromExcel(String fileName) throws Exception {
        List<ExternalNgoDto> list = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource(fileName);
        if (!resource.exists()) {
            throw new Exception("File not found: " + fileName);
        }

        try (InputStream is = resource.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue;
                }
                ExternalNgoDto dto = new ExternalNgoDto();
                dto.setOrg_name(getCellValue(row.getCell(0)));
                dto.setCity(getCellValue(row.getCell(1)));
                dto.setFocus_area(getCellValue(row.getCell(2)));
                dto.setRegistration_status(getCellValue(row.getCell(3)));
                list.add(dto);
            }
        }
        return list;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private List<LawyerProfile> filterLawyersByVerified(List<LawyerProfile> list, Boolean verified) {
        if (verified == null) {
            return list;
        }
        return list.stream().filter(l -> l.isVerified() == verified).toList();
    }

    private List<NgoProfile> filterNgosByVerified(List<NgoProfile> list, Boolean verified) {
        if (verified == null) {
            return list;
        }
        return list.stream().filter(n -> n.isVerified() == verified).toList();
    }
}
