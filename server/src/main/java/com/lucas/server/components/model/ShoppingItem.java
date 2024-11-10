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
    @JsonProperty("CATEGORY_ID")
    private Integer categoryId;
    @JsonProperty("CATEGORY")
    private String category;
    @JsonProperty("ORDER")
    private Integer categoryOrder;
    @JsonProperty("QUANTITY")
    private Integer quantity;
}
