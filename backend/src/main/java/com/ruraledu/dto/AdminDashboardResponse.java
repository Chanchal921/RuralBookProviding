package com.ruraledu.dto;

import java.util.List;

public class AdminDashboardResponse {
    private long totalUsers;
    private long studentsCount;
    private long donorsCount;
    private long teachersCount;
    private long ngosCount;

    private long totalResources;
    private long pendingResources;
    private long approvedResources;
    private long rejectedResources;
    private long deactivatedResources;

    private long totalRequests;
    private long pendingRequests;
    private long matchedRequests;
    private long completedRequests;

    private List<ResourceResponse> recentResources;
    private List<ResourceRequestResponse> recentRequests;

    public AdminDashboardResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getStudentsCount() {
        return studentsCount;
    }

    public void setStudentsCount(long studentsCount) {
        this.studentsCount = studentsCount;
    }

    public long getDonorsCount() {
        return donorsCount;
    }

    public void setDonorsCount(long donorsCount) {
        this.donorsCount = donorsCount;
    }

    public long getTeachersCount() {
        return teachersCount;
    }

    public void setTeachersCount(long teachersCount) {
        this.teachersCount = teachersCount;
    }

    public long getNgosCount() {
        return ngosCount;
    }

    public void setNgosCount(long ngosCount) {
        this.ngosCount = ngosCount;
    }

    public long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(long totalResources) {
        this.totalResources = totalResources;
    }

    public long getPendingResources() {
        return pendingResources;
    }

    public void setPendingResources(long pendingResources) {
        this.pendingResources = pendingResources;
    }

    public long getApprovedResources() {
        return approvedResources;
    }

    public void setApprovedResources(long approvedResources) {
        this.approvedResources = approvedResources;
    }

    public long getRejectedResources() {
        return rejectedResources;
    }

    public void setRejectedResources(long rejectedResources) {
        this.rejectedResources = rejectedResources;
    }

    public long getDeactivatedResources() {
        return deactivatedResources;
    }

    public void setDeactivatedResources(long deactivatedResources) {
        this.deactivatedResources = deactivatedResources;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getMatchedRequests() {
        return matchedRequests;
    }

    public void setMatchedRequests(long matchedRequests) {
        this.matchedRequests = matchedRequests;
    }

    public long getCompletedRequests() {
        return completedRequests;
    }

    public void setCompletedRequests(long completedRequests) {
        this.completedRequests = completedRequests;
    }

    public List<ResourceResponse> getRecentResources() {
        return recentResources;
    }

    public void setRecentResources(List<ResourceResponse> recentResources) {
        this.recentResources = recentResources;
    }

    public List<ResourceRequestResponse> getRecentRequests() {
        return recentRequests;
    }

    public void setRecentRequests(List<ResourceRequestResponse> recentRequests) {
        this.recentRequests = recentRequests;
    }
}

