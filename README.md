# camunda-process-view-plugins

[![Test on Ubuntu](https://github.com/UST-QuAntiL/camunda-process-views-plugin/actions/workflows/test.yml/badge.svg)](https://github.com/UST-QuAntiL/camunda-process-views-plugin/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Plugins for the Camunda engine to visualize process views generated by the [Quantum Workflow Modeler](https://github.com/PlanQK/workflow-modeler).
    
A use case showcasing the usage of the plugin can be found [here](https://github.com/UST-QuAntiL/QuantME-UseCases/tree/master/2024-caise).

## Integrate into Camunda Platform Webapp

1. Build the Camunda Cockpit plugin:
```sh
mvn clean install
```

2. [Download](https://downloads.camunda.cloud/release/camunda-bpm/run/7.17/) the Camunda run distribution

3. Copy the plugin jar file (located in `./target/`) to the `/configuration/userlib/` folder and start the server
4. Add the following to the camunda configuration `default.yml` to enable access to winery
```yaml
camunda.bpm:
  webapp:
    header-security:
       content-security-policy-disabled: true
```


## Run using Docker
Build the docker image:
```sh
docker build -t camunda-deployment-view-plugins .
```

Run the docker image:
```sh
docker run -p 8080:8080 camunda-deployment-view-plugins
```

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden, ausgeschlossen.
