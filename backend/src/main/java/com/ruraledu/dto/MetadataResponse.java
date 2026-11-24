package com.ruraledu.dto;

import com.ruraledu.entity.ClassLevel;
import com.ruraledu.entity.ResourceType;
import com.ruraledu.entity.Subject;

import java.util.List;

public class MetadataResponse {
    private List<ResourceType> resourceTypes;
    private List<Subject> subjects;
    private List<ClassLevel> classLevels;

    public MetadataResponse() {
    }

    public MetadataResponse(List<ResourceType> resourceTypes, List<Subject> subjects, List<ClassLevel> classLevels) {
        this.resourceTypes = resourceTypes;
        this.subjects = subjects;
        this.classLevels = classLevels;
    }

    public List<ResourceType> getResourceTypes() {
        return resourceTypes;
    }

    public void setResourceTypes(List<ResourceType> resourceTypes) {
        this.resourceTypes = resourceTypes;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }

    public List<ClassLevel> getClassLevels() {
        return classLevels;
    }

    public void setClassLevels(List<ClassLevel> classLevels) {
        this.classLevels = classLevels;
    }
}

