package rapidresponse.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import rapidresponse.backend.model.Report;
import rapidresponse.backend.repository.ReportRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_SERVICE_URL = "http://localhost:5000/classify";

    public Report createReport(Report report) {
        classifyReport(report);
        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report updateStatus(Long id, String newStatus) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
        report.setStatus(newStatus);
        return reportRepository.save(report);
    }

    @SuppressWarnings("unchecked")
    private void classifyReport(Report report) {
        try {
            // Python AI service ko call karo
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("description", report.getDescription());

            Map<String, String> response = restTemplate.postForObject(AI_SERVICE_URL, requestBody, Map.class);

            if (response != null) {
                report.setCategory(response.get("category"));
                report.setPriority(response.get("priority"));
            } else {
                fallbackClassification(report);
            }
        } catch (Exception e) {
            // Agar AI service down ho, toh fallback use karo (system crash nahi hoga)
            System.out.println("AI service unavailable, using fallback: " + e.getMessage());
            fallbackClassification(report);
        }
    }

    // Fallback: agar Python service kisi wajah se available na ho
    private void fallbackClassification(Report report) {
        String desc = report.getDescription().toLowerCase();

        if (desc.contains("medical") || desc.contains("injured") || desc.contains("hospital") || desc.contains("saans") || desc.contains("beemar")) {
            report.setCategory("Medical");
            report.setPriority("High");
        } else if (desc.contains("food") || desc.contains("khana") || desc.contains("hungry")) {
            report.setCategory("Food");
            report.setPriority("Medium");
        } else if (desc.contains("water") || desc.contains("flood") || desc.contains("paani") || desc.contains("rescue")) {
            report.setCategory("Rescue");
            report.setPriority("High");
        } else {
            report.setCategory("Shelter");
            report.setPriority("Low");
        }
    }
}