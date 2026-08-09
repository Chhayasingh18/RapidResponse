package rapidresponse.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rapidresponse.backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}