package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class LoadTestResponse {
    private int users;
    private double successRate;
    private long p50;
    private long p95;
    private long p99;
    private List<Long> responseTimes;
}
