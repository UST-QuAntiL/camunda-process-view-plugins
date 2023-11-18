FROM maven:3.9.4-eclipse-temurin-11-focal as builder
COPY ./ /app
WORKDIR /app
RUN mvn install -DskipTests -f pom.xml
RUN ls -la /app/target

FROM camunda/camunda-bpm-platform:run-7.17.0-SNAPSHOT
COPY --chown=camunda:camunda --from=builder /app/target/camunda-process-views-plugin-1.0-SNAPSHOT.jar /camunda/configuration/userlib/camunda-process-views-plugin-1.0-SNAPSHOT.jar
RUN sed -i "s/camunda.bpm:/camunda.bpm:\n  webapp:\n    header-security:\n       content-security-policy-disabled: true/g" /camunda/configuration/default.yml