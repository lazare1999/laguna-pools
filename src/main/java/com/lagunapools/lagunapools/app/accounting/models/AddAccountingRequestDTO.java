package com.lagunapools.lagunapools.app.accounting.models;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddAccountingRequestDTO {
    Long clientId;
    Double amount;
    String type;
    String note;
}
