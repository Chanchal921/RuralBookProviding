package com.ruraledu.dto;

import java.util.List;

public class StudentDashboardResponse {
    private long totalAvailableResources;
    private long myTotalRequests;
    private long myPendingRequests;
    private long myMatchedRequests;
    private List<ResourceResponse> recentlyAddedResources;
    private List<ResourceRequestResponse> myRecentRequests;

    public StudentDashboardResponse() {
    }

    public long getTotalAvailableResources() {
        return totalAvailableResources;
    }

    public void setTotalAvailableResources(long totalAvailableResources) {
        this.totalAvailableResources = totalAvailableResources;
    }

    public long getMyTotalRequests() {
        return myTotalRequests;
    }

    public void setMyTotalRequests(long myTotalRequests) {
        this.myTotalRequests = myTotalRequests;
    }

    public long getMyPendingRequests() {
        return myPendingRequests;
    }

    public void setMyPendingRequests(long myPendingRequests) {
        this.myPendingRequests = myPendingRequests;
    }

    public long getMyMatchedRequests() {
        return myMatchedRequests;
    }

    public void setMyMatchedRequests(long myMatchedRequests) {
        this.myMatchedRequests = myMatchedRequests;
    }

    public List<ResourceResponse> getRecentlyAddedResources() {
        return recentlyAddedResources;
    }

    public void setRecentlyAddedResources(List<ResourceResponse> recentlyAddedResources) {
        this.recentlyAddedResources = recentlyAddedResources;
    }

    public List<ResourceRequestResponse> getMyRecentRequests() {
        return myRecentRequests;
    }

    public void setMyRecentRequests(List<ResourceRequestResponse> myRecentRequests) {
        this.myRecentRequests = myRecentRequests;
    }
}

