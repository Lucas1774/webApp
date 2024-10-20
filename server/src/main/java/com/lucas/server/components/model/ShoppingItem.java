package com.lucas.server.components.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShoppingItem {
    private long id;
    private String name;
    private int quantity;
}
