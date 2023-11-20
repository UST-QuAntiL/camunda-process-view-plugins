export async function renderDeploymentInformationTable(node, {processInstanceId, api}) {
    node.innerHTML = "Loading..."
    const {cockpitApi, engine} = api;
    const processViewEndpoint = `${cockpitApi}/plugin/camunda-deployment-view-plugin/${engine}/process-instance/${processInstanceId}/deployment-info`;
    console.log('Retrieving currently active view using URL: ', processViewEndpoint);
    let res = await fetch(processViewEndpoint, {
        headers: {
            'Accept': 'application/json'
        }
    })
    const deploymentInformation = await res.json();
    if (deploymentInformation.length === 0) {
        node.innerHTML = "No deployments found."
        return;
    }
    const body = deploymentInformation
        .map(({
                  csarName,
                  buildPlanState,
                  instanceState,
                  instanceCreatedAt
              }) => `<tr>
                                <td>${csarName}</td>
                                <td>${buildPlanState}</td>
                                <td>${instanceState}</td>
                                <td>${new Date(instanceCreatedAt).toISOString()}</td>
                            </tr>`).join("\n")

    node.innerHTML = `<table class="cam-table">
                <thead>
                    <tr>
                        <th>CSAR</th>
                        <th>Build plan state</th>
                        <th>Instance plan state</th>
                        <th>Instance created at</th>
                    </tr>
                </thead>
                <tbody>
                    ${body}
                </tbody>
            </table>`
}