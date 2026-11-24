package com.ruraledu.dto;

import java.util.List;

public class TeacherDashboardResponse {
    private long availableResources;
    private long myUploadedResources;
    private long myRequests;
    private long pendingRequests;
    private long matchedRequests;
    private List<ResourceResponse> recentResources;
    private List<ResourceRequestResponse> myRecentRequests;

    public TeacherDashboardResponse() {
    }

    public long getAvailableResources() {
        return availableResources;
    }

    public void setAvailableResources(long availableResources) {
        this.availableResources = availableResources;
    }

    public long getMyUploadedResources() {
        return myUploadedResources;
    }

    public void setMyUploadedResources(long myUploadedResources) {
        this.myUploadedResources = myUploadedResources;
    }

    public long getMyRequests() {
        return myRequests;
    }

    public void setMyRequests(long myRequests) {
        this.myRequests = myRequests;
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

    public List<ResourceResponse> getRecentResources() {
        return recentResources;
    }

    public void setRecentResources(List<ResourceResponse> recentResources) {
        this.recentResources = recentResources;
    }

    public List<ResourceRequestResponse> getMyRecentRequests() {
        return myRecentRequests;
    }

    public void setMyRecentRequests(List<ResourceRequestResponse> myRecentRequests) {
        this.myRecentRequests = myRecentRequests;
    }
}

