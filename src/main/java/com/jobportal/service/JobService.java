package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // GET all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // SEARCH jobs by title
    public List<Job> searchJobsByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    // POST create job (with posted date)
    public Job saveJob(Job job) {
        job.setPostedDate(LocalDate.now()); // auto-set date
        return jobRepository.save(job);
    }

    // PUT update job
    public Job updateJob(Long id, Job updatedJob) {
        Optional<Job> optionalJob = jobRepository.findById(id);

        if (optionalJob.isPresent()) {
            Job existingJob = optionalJob.get();
            existingJob.setTitle(updatedJob.getTitle());
            existingJob.setCompany(updatedJob.getCompany());
            existingJob.setLocation(updatedJob.getLocation());
            existingJob.setDescription(updatedJob.getDescription());

            // keep old posted date
            existingJob.setPostedDate(existingJob.getPostedDate());

            return jobRepository.save(existingJob);
        } else {
            throw new RuntimeException("Job not found with id " + id);
        }
    }

    // DELETE job
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
