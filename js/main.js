
async function addCIBuilds() {
    var buildsSection = document.getElementById("beta-builds-list");

    if('content' in document.createElement('template')) {
        showLoading();

        // get template elements
        const templateRoot = document.getElementById("build-template");
        const templateJob = document.getElementById("build-job-template");

        const artifacts = await getArtifacts();
        // hide loading screen
        clearBlankslate();

        for(let i = 0; i < artifacts.length; i++) {
            const arti = artifacts[i];
            //console.log(arti);

            // create a clone of the template and fill it with data
            const clone = document.importNode(templateRoot.content, true);
            const jobsWrapper = clone.getElementById("build_jobs");

            const pipelineLink = clone.getElementById("build_pipeline-id");
            pipelineLink.innerText = "#" + arti.id;
            pipelineLink.href = arti.url;

            let latest = false;
            // show latest label if this is the first item and mark as latest
            if(i == 0) {
                latest = true;
                const latestLabel = clone.getElementById("build-latest");
                latestLabel.style.display = "unset";
            }

            // loop over jobs
            for(let j = 0; j < arti.jobs.length; j++) {
                const job = arti.jobs[j];

                // create a clone of the job template and fill it with data
                const jclone = document.importNode(templateJob.content, true);

                const jobId = jclone.getElementById("build_job-id");
                jobId.innerText = "#" + job.id;
                jobId.href = job.url;

                const date = new Date(job.commitDate);
                const jobDate = jclone.getElementById("build_job-date");
                jobDate.innerText = date.toLocaleString();

                const jobMessage = jclone.getElementById("build_job-message-wrapper");
                jobMessage.setAttribute("aria-label", job.commitMessage);

                const jobTitle = jclone.getElementById("build_job-title");
                jobTitle.innerText = job.commitTitle;

                const jobDownload = jclone.getElementById("build_job-download");
                jobDownload.href = job.artifacts;
                if(latest) {
                    // latest pipeline has primary button color
                    jobDownload.classList.add("btn-primary");
                }

                jobsWrapper.appendChild(jclone);

                if(j < arti.jobs.length - 1) {
                    // add divider
                    const divider = document.createElement("div");
                    divider.classList.add("border-bottom", "my-3");
                    jobsWrapper.appendChild(divider);
                }
            }

            // add to builds list
            buildsSection.appendChild(clone);
        }
        
    } else {
        clearBlankslate();
        var title = document.createElement("h3");
        title.innerText = "Your browser is not supported";
        title.classList.add("mb-1");
        showBlankslate(title);
    }
}

function showLoading() {
    clearBlankslate();
    var title = document.createElement("h3");
    title.innerHTML = "<span>Loading</span><span class='AnimatedEllipsis'></span>";
    title.classList.add("mb-1");
    showBlankslate(title);
}

function showBlankslate(content) {
    var blankslate = document.createElement("div");
    blankslate.id = "builds-blankslate";
    blankslate.classList.add("blankslate");
    blankslate.appendChild(content);

    var buildsSection = document.getElementById("beta-builds-list");
    buildsSection.appendChild(blankslate);
}

function clearBlankslate() {
    var blankslate = document.getElementById("builds-blankslate");
    if(blankslate) {
        var buildsSection = document.getElementById("beta-builds-list");
        buildsSection.removeChild(blankslate);
    }
}

addCIBuilds();
