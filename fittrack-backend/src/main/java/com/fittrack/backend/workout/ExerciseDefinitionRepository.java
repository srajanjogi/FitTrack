package com.fittrack.backend.workout;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExerciseDefinitionRepository extends JpaRepository<ExerciseDefinition, Long> {

    Optional<ExerciseDefinition> findByNameIgnoreCase(String name);

    List<ExerciseDefinition> findAllByActiveTrueOrderByNameAsc();
}

