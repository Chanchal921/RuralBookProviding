package com.ruraledu.service.impl;

import com.ruraledu.dto.MetadataResponse;
import com.ruraledu.repository.ClassLevelRepository;
import com.ruraledu.repository.ResourceTypeRepository;
import com.ruraledu.repository.SubjectRepository;
import com.ruraledu.service.MetadataService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MetadataServiceImpl implements MetadataService {

    private final ResourceTypeRepository resourceTypeRepository;
    private final SubjectRepository subjectRepository;
    private final ClassLevelRepository classLevelRepository;

    public MetadataServiceImpl(ResourceTypeRepository resourceTypeRepository,
                               SubjectRepository subjectRepository,
                               ClassLevelRepository classLevelRepository) {
        this.resourceTypeRepository = resourceTypeRepository;
        this.subjectRepository = subjectRepository;
        this.classLevelRepository = classLevelRepository;
    }

    @Override
    public MetadataResponse getAllMetadata() {
        return new MetadataResponse(
                resourceTypeRepository.findAllByOrderByNameAsc(),
                subjectRepository.findAllByOrderByNameAsc(),
                classLevelRepository.findAllByOrderByStandardOrderAsc()
        );
    }
}

