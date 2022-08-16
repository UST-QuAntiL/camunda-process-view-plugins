# camunda-process-views-plugin

[![Test on Ubuntu](https://github.com/UST-QuAntiL/camunda-process-views-plugin/actions/workflows/test.yml/badge.svg)](https://github.com/UST-QuAntiL/camunda-process-views-plugin/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

TODO

## Integrate into Camunda Platform Webapp

1. Build the Camunda Cockpit plugin: 
```sh
mvn clean install
```

2. [Download](https://camunda.com/download/) the Camunda tomcat distribution (tested with 7.17.0)

3. Copy the plugin jar file (located in `./target/`) to the `/server/apache-tomcat-${tomcat-version}/webapps/camunda/WEB-INF/lib/` folder and start the server

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden, ausgeschlossen.