package com.yu.cloudattend.yu_cloudattend.service;

import com.yu.cloudattend.yu_cloudattend.dto.LoadTestResponse;
import com.yu.cloudattend.yu_cloudattend.repository.ClassSessionRepository;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LoadTestService {

    private static final Logger log = LoggerFactory.getLogger(LoadTestService.class);

    private final StudentRepository studentRepository;
    private final ClassSessionRepository classSessionRepository;

    public LoadTestResponse simulate(int users) {
        log.info("[LoadTestService] simulate - users={}", users);

        ExecutorService executor = Executors.newFixedThreadPool(Math.min(users, 200));
        AtomicInteger successCount = new AtomicInteger(0);
        List<Long> responseTimes = Collections.synchronizedList(new ArrayList<>());

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (int i = 0; i < users; i++) {
            futures.add(CompletableFuture.runAsync(() -> {
                long start = System.currentTimeMillis();
                try {
                    // 실제 출석체크와 동일한 DB 조회 경로를 실행
                    studentRepository.findById(1L);
                    classSessionRepository.findById(1L);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    log.debug("[LoadTestService] simulate - 요청 실패: {}", e.getMessage());
                } finally {
                    responseTimes.add(System.currentTimeMillis() - start);
                }
            }, executor));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executor.shutdown();

        List<Long> sorted = new ArrayList<>(responseTimes);
        Collections.sort(sorted);

        double successRate = users == 0 ? 0
                : Math.round((successCount.get() * 1000.0 / users)) / 10.0;

        LoadTestResponse response = new LoadTestResponse(
                users,
                successRate,
                percentile(sorted, 50),
                percentile(sorted, 95),
                percentile(sorted, 99),
                sorted
        );

        log.info("[LoadTestService] simulate 완료 - users={}, successRate={}, p95={}ms",
                users, successRate, response.getP95());
        return response;
    }

    private long percentile(List<Long> sorted, int p) {
        if (sorted.isEmpty()) return 0;
        int idx = (int) Math.ceil(p / 100.0 * sorted.size()) - 1;
        return sorted.get(Math.max(0, Math.min(idx, sorted.size() - 1)));
    }
}
