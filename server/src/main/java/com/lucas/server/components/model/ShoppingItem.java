package com.lucas.server.components.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShoppingItem {
    private int id;
    private String name;
    private int quantity;
}
