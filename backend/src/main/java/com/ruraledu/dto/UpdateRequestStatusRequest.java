package com.ruraledu.dto;

import com.ruraledu.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateRequestStatusRequest {

    @NotNull(message = "Status is required")
    private RequestStatus status;

    private Long matchedResourceId;

    private String adminRemarks;

    public UpdateRequestStatusRequest() {
    }

    public UpdateRequestStatusRequest(RequestStatus status, Long matchedResourceId, String adminRemarks) {
        this.status = status;
        this.matchedResourceId = matchedResourceId;
        this.adminRemarks = adminRemarks;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Long getMatchedResourceId() {
        return matchedResourceId;
    }

    public void setMatchedResourceId(Long matchedResourceId) {
        this.matchedResourceId = matchedResourceId;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}

