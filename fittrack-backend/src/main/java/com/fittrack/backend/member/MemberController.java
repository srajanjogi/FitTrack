package com.fittrack.backend.member;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for basic Member CRUD operations.
 *
 * In a real app we would use DTOs; for now we keep it simple and
 * expose the entity directly to get you productive quickly.
 */
@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@Valid @RequestBody Member member) {
        if (member.getJoinDate() == null) {
            member.setJoinDate(LocalDate.now());
        }
        if (member.getStatus() == null) {
            member.setStatus(MemberStatus.ACTIVE);
        }
        Member saved = memberRepository.save(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @Valid @RequestBody Member updated) {
        return memberRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(updated.getFullName());
                    existing.setEmail(updated.getEmail());
                    existing.setPhone(updated.getPhone());
                    existing.setDateOfBirth(updated.getDateOfBirth());
                    existing.setStatus(updated.getStatus());
                    return ResponseEntity.ok(memberRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (!memberRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        memberRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

