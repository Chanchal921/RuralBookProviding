package com.ruraledu.dto;

import java.util.List;

public class DonorDashboardResponse {
    private long totalUploaded;
    private long approvedUploads;
    private long pendingUploads;
    private long rejectedUploads;
    private long totalDonations;
    private List<ResourceResponse> recentUploads;

    public DonorDashboardResponse() {
    }

    public long getTotalUploaded() {
        return totalUploaded;
    }

    public void setTotalUploaded(long totalUploaded) {
        this.totalUploaded = totalUploaded;
    }

    public long getApprovedUploads() {
        return approvedUploads;
    }

    public void setApprovedUploads(long approvedUploads) {
        this.approvedUploads = approvedUploads;
    }

    public long getPendingUploads() {
        return pendingUploads;
    }

    public void setPendingUploads(long pendingUploads) {
        this.pendingUploads = pendingUploads;
    }

    public long getRejectedUploads() {
        return rejectedUploads;
    }

    public void setRejectedUploads(long rejectedUploads) {
        this.rejectedUploads = rejectedUploads;
    }

    public long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(long totalDonations) {
        this.totalDonations = totalDonations;
    }

    public List<ResourceResponse> getRecentUploads() {
        return recentUploads;
    }

    public void setRecentUploads(List<ResourceResponse> recentUploads) {
        this.recentUploads = recentUploads;
    }
}

