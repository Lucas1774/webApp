package com.lucas.server.components.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShoppingItem {
    @JsonProperty("ID")
    private int id;
    @JsonProperty("NAME")
    private String name;
    @JsonProperty("QUANTITY")
    private int quantity;
}
