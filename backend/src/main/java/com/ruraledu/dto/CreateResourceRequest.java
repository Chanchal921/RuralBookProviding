package com.ruraledu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateResourceRequest {

    @NotBlank(message = "Resource name is required")
    @Size(min = 3, max = 200, message = "Resource name must be between 3 and 200 characters")
    private String resourceName;

    @NotNull(message = "Class level is required")
    private Long classLevelId;

    @NotNull(message = "Subject is required")
    private Long subjectId;

    @NotNull(message = "Resource type is required")
    private Long resourceTypeId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    @NotBlank(message = "Reason for request is required")
    private String reason;

    public CreateResourceRequest() {
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public Long getClassLevelId() {
        return classLevelId;
    }

    public void setClassLevelId(Long classLevelId) {
        this.classLevelId = classLevelId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getResourceTypeId() {
        return resourceTypeId;
    }

    public void setResourceTypeId(Long resourceTypeId) {
        this.resourceTypeId = resourceTypeId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

