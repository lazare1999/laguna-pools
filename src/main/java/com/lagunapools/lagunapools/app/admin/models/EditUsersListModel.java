package com.lagunapools.lagunapools.app.admin.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class EditUsersListModel {
    private List<EditUserModel> users;
}
