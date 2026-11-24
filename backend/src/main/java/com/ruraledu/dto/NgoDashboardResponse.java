package com.ruraledu.dto;

import java.util.List;

public class NgoDashboardResponse {
    private long totalUploaded;
    private long approvedResources;
    private long pendingSubmissions;
    private long totalOpenRequests;
    private List<ResourceResponse> recentUploads;

    public NgoDashboardResponse() {
    }

    public long getTotalUploaded() {
        return totalUploaded;
    }

    public void setTotalUploaded(long totalUploaded) {
        this.totalUploaded = totalUploaded;
    }

    public long getApprovedResources() {
        return approvedResources;
    }

    public void setApprovedResources(long approvedResources) {
        this.approvedResources = approvedResources;
    }

    public long getPendingSubmissions() {
        return pendingSubmissions;
    }

    public void setPendingSubmissions(long pendingSubmissions) {
        this.pendingSubmissions = pendingSubmissions;
    }

    public long getTotalOpenRequests() {
        return totalOpenRequests;
    }

    public void setTotalOpenRequests(long totalOpenRequests) {
        this.totalOpenRequests = totalOpenRequests;
    }

    public List<ResourceResponse> getRecentUploads() {
        return recentUploads;
    }

    public void setRecentUploads(List<ResourceResponse> recentUploads) {
        this.recentUploads = recentUploads;
    }
}

