package com.fittrack.backend.member;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Member entity represents a gym member in FitTrack.
 */
@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status;
}

