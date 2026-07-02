package com.example.smarter.models;

import java.util.List;

public class TriageSummary {
    private List<Field> fields;

    public TriageSummary(List<Field> fields) {
        this.fields = fields;
    }

    public List<Field> getFields() { return fields; }

    public static class Field {
        private String label;
        private String value;

        public Field(String label, String value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() { return label; }
        public String getValue() { return value; }
    }
}
