import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceApi } from '../api/resourceApi';
import ResourceCard from '../components/resources/ResourceCard';
import FilterPanel from '../components/resources/FilterPanel';
import SearchBar from '../components/resources/SearchBar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [resources, setResources] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subjectId') ? Number(searchParams.get('subjectId')) : null);
  const [selectedClass, setSelectedClass] = useState(searchParams.get('classLevelId') ? Number(searchParams.get('classLevelId')) : null);
  const [selectedType, setSelectedType] = useState(searchParams.get('resourceTypeId') ? Number(searchParams.get('resourceTypeId')) : null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load Master Metadata once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await resourceApi.getMetadata();
        if (res.success && res.data) {
          setMetadata(res.data);
        }
      } catch (err) {
        console.error('Failed to load master metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch approved resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 9,
        sortBy: 'createdAt',
        direction: 'DESC',
      };
      if (keyword) params.keyword = keyword;
      if (selectedSubject) params.subjectId = selectedSubject;
      if (selectedClass) params.classLevelId = selectedClass;
      if (selectedType) params.resourceTypeId = selectedType;

      const res = await resourceApi.getApprovedResources(params);
      if (res.success && res.data) {
        setResources(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load library resources', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedSubject, selectedClass, selectedType, currentPage]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Handlers
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedSubject(null);
    setSelectedClass(null);
    setSelectedType(null);
    setCurrentPage(0);
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-book-half text-success me-2"></i> Digital Library
          </h2>
          <p className="text-muted small mb-0">
            Approved curriculum textbooks, notes, worksheets, and question papers for rural schools
          </p>
        </div>
        <div className="mt-2 mt-md-0">
          <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
            {totalElements} Verified Resources Available
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} placeholder="Search by title, subject, or keyword..." />

      {/* Filter Panel */}
      <FilterPanel
        metadata={metadata}
        selectedSubject={selectedSubject}
        selectedClass={selectedClass}
        selectedType={selectedType}
        onSubjectChange={(val) => { setSelectedSubject(val); setCurrentPage(0); }}
        onClassChange={(val) => { setSelectedClass(val); setCurrentPage(0); }}
        onTypeChange={(val) => { setSelectedType(val); setCurrentPage(0); }}
        onReset={handleResetFilters}
      />

      {/* Results Section */}
      {loading ? (
        <LoadingSpinner text="Searching verified library resources..." />
      ) : resources.length === 0 ? (
        <EmptyState
          icon="bi-journal-x"
          title="No Approved Resources Found"
          message="We could not find any verified resources matching your current search criteria. Try removing filters or requesting this item."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="row g-3">
            {resources.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
                <ResourceCard resource={item} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </>
      )}
    </div>
  );
};

export default LibraryPage;

