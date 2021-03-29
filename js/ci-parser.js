/**
 * Parse pipeline jobs from the gitlab api and generate
 * a link to the job artifacts.
 */
const projectID = 21709506
const baseURL = `https://gitlab.com/api/v4/projects/${projectID}`;
const browseStartURL = "https://gitlab.com/Drumber/RemoteLight/-/jobs/";
const browseEndURL = "/artifacts/browse/remotelight-client/target";

/**
 * The number of pipelines that should be shown.
 * By default show the latest 5 pipelines.
 */
const numberOfPipelines = 5;

/**
 * Request pipelines that were successful.
 * By default gitlab returns 20 results.
 * @see https://docs.gitlab.com/ee/api/pipelines.html
 * @returns array   containing the objects with pipeline ID [id]
 *                  and pipeline url [url]
 */
async function getPipelines() {
    const url = baseURL + "/pipelines?status=success";
    // request list of pipelines
    const response = await fetch(url, {
        method: 'GET',
        cache: 'reload'
    });
    // parse json from response
    const json = await response.json();

    // extract pipeline IDs and URLs from json response
    var pipelineIDs = [];
    for(let i = 0; i < json.length; i++) {
        pipelineIDs.push({
            id: json[i].id,
            url: json[i].web_url
        });
    }
    return pipelineIDs;
}

/**
 * Request all jobs of a pipeline that were successful.
 * @see https://docs.gitlab.com/ee/api/jobs.html
 * @param {String} pipelineID ID of the pipeline
 * @returns jobs as json object
 */
async function getJobsOfPipeline(pipelineID) {
    const url = baseURL + `/pipelines/${pipelineID}/jobs?status=success`;
    // request list of jobs of the specified pipeline
    const response = await fetch(url, {
        method: 'GET',
        cache: 'reload'
    });
    // parse json from response
    return await response.json();
}

/**
 * Get an array of artifact objects containing
 * pipelines and its jobs with artifacts.
 */
async function getArtifacts() {
    const pipelines = await getPipelines();
    console.log("received", pipelines.length, "pipelines")
    /* 
        [{
            id: <pipeline ID>,
            url: <pipeline url>,
            jobs: [
                id: <job ID>,
                url: <job url>,
                commitDate: <time of commit>,
                commitURL: <url to commit>,
                commitTitle: <commit title>,
                commitMessage: <commit message>,
                artifacts: <browse artifacts url>
            ]
        },
        ...
        ]
    */
    var artifacts = [];

    // limit the number of pipelines
    let maxPipelines = pipelines.length;
    if(maxPipelines > numberOfPipelines) {
        maxPipelines = numberOfPipelines;
    }

    for(let i = 0; i < maxPipelines; i++) {
        // add pipeline data to artifact object
        var artifactObj = {
            id: pipelines[i].id,
            url: pipelines[i].url,
            jobs: []
        }

        // get the jobs of the pipeline
        const jobs = await getJobsOfPipeline(pipelines[i].id);
        for(let j = 0; j < jobs.length; j++) {
            const job = jobs[j];
            const browseURL = browseStartURL + job.id + browseEndURL;

            artifactObj.jobs.push({
                id: job.id,
                url: job.web_url,
                commitDate: job.commit.created_at,
                commitURL: job.commit.web_url,
                commitTitle: job.commit.title,
                commitMessage: job.commit.message,
                artifacts: browseURL
            });
        }

        // add artifact data to artifacts array
        artifacts.push(artifactObj);
    }

    return artifacts;
}
