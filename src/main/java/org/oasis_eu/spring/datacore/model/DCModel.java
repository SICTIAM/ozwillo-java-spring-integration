package org.oasis_eu.spring.datacore.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URI;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DCModel {

    @JsonProperty("@id")
    private URI id;

    @JsonProperty("dcmo:name")
    private String name;

    @JsonProperty("dcmo:globalFields")
    private List<DcModelField> fields;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public URI getId() {
        return id;
    }

    public void setId(URI id) {
        this.id = id;
    }

    public List<DcModelField> getFields() {
        return fields;
    }

    public void setFields(List<DcModelField> fields) {
        this.fields = fields;
    }

    @Override
    public String toString() {
        return "DCModel{" +
            "id=" + id +
            '}';
    }

    public static class DcModelField {

        @JsonProperty("dcmf:name")
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public DcModelField() {
        }
    }
}
