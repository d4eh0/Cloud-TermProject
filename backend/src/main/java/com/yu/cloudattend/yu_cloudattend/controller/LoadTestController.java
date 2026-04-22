package com.yu.cloudattend.yu_cloudattend.controller;

import com.yu.cloudattend.yu_cloudattend.dto.LoadTestRequest;
import com.yu.cloudattend.yu_cloudattend.dto.LoadTestResponse;
import com.yu.cloudattend.yu_cloudattend.service.LoadTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/load-test")
@RequiredArgsConstructor
public class LoadTestController {

    private final LoadTestService loadTestService;

    @PostMapping("/simulate")
    public ResponseEntity<LoadTestResponse> simulate(@Valid @RequestBody LoadTestRequest request) {
        return ResponseEntity.ok(loadTestService.simulate(request.getUsers()));
    }
}
