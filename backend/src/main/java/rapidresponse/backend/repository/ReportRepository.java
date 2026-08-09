package rapidresponse.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rapidresponse.backend.model.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
}