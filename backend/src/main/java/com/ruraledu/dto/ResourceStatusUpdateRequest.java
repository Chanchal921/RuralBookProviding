package com.ruraledu.dto;

import com.ruraledu.enums.ResourceStatus;
import jakarta.validation.constraints.NotNull;

public class ResourceStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private String adminRemarks;

    public ResourceStatusUpdateRequest() {
    }

    public ResourceStatusUpdateRequest(ResourceStatus status, String adminRemarks) {
        this.status = status;
        this.adminRemarks = adminRemarks;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}

