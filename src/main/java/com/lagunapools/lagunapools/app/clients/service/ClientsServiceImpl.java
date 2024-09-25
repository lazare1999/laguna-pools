package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.utils.LazoUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;
import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
@RequiredArgsConstructor
public class ClientsServiceImpl implements ClientsService {

    private static final Logger logger = LoggerFactory.getLogger(ClientsServiceImpl.class);

    private final ClientsRepository clientsRepository;

    @Override
    public AllClientsResponseDTO getAllClients(AllClientsRequestDTO request) {
        if (Objects.isNull(request)
                || request.getPageKey() == null
                || request.getPageSize() == null) {
            return new AllClientsResponseDTO();
        }

        var clientPage = clientsRepository.findAll((root, query, builder) -> {

            Objects.requireNonNull(query).distinct(true);
            Predicate predicate = builder.conjunction();

            if (StringUtils.isNotEmpty(request.getClientName())) {
                predicate = builder.and(predicate, builder.like(root.get("firstName"), "%" + request.getClientName() + "%"));
            }

            return predicate;
        }, PageRequest.of(request.getPageKey(), request.getPageSize(), LazoUtils.getSortAsc("id")));

        List<ClientDTO> clientsList = clientPage.stream().map(ClientDTO::new).toList();

        return new AllClientsResponseDTO(clientPage.getTotalElements(), clientsList);
    }

    @Override
    public ResponseEntity<?> addClient(ClientDTO client) {
        try {
            clientsRepository.save(new ClientsEntity(client, getCurrentApplicationUser().getUsername()));
        } catch (Exception ex) {
            logger.error("An error occurred", ex);
            return badRequestResponse(ex.getStackTrace());
        }
        return okResponse(true);
    }

    @Override
    public ResponseEntity<?> getClient(Long clientId) {
        return okResponse(clientsRepository.findById(clientId));
    }


}
