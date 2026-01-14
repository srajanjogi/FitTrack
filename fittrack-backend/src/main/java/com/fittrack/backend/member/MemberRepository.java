package com.fittrack.backend.member;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Member persistence operations.
 */
public interface MemberRepository extends JpaRepository<Member, Long> {
}

