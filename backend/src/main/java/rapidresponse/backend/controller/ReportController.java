package rapidresponse.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import rapidresponse.backend.model.Report;
import rapidresponse.backend.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // Naya report submit karna
    // POST http://localhost:8080/api/reports
    @PostMapping
    public Report createReport(@RequestBody Report report) {
        return reportService.createReport(report);
    }

    // Saare reports fetch karna (dashboard ke liye)
    // GET http://localhost:8080/api/reports
    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    // Kisi report ka status update karna
    // PUT http://localhost:8080/api/reports/1/status?status=RESOLVED
    @PutMapping("/{id}/status")
    public Report updateStatus(@PathVariable Long id, @RequestParam String status) {
        return reportService.updateStatus(id, status);
    }
}