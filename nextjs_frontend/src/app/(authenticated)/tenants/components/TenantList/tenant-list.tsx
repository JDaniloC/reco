"use client";

import { useEffect, useState } from "react";

import { Devedor } from "@/models/Devedores";
import Search from "@/components/Search/search";
import DebtorCard from "../DebtorCard/debtor-card";
import Dropdown from "@/components/Dropdown/dropdown";
import Paginator from "@/components/Paginator/paginator";
import { filterByCodominiumAndMonths, getUniqueMonths } from "@/services/tableUtils";
import { INegotiationData } from "../TenantModal/components/Modal-content";
import TenantModal from "../TenantModal/tenant-modal";
import LoadingBar from "@/components/Loading/loading";

interface TenantListProps {
  tenants: Devedor[];
  loading: boolean;
  onCreateAgreement: (
    debtor: Devedor,
    negotiation: INegotiationData
  ) => Promise<string | null>;
  onRemoveTenant: (cpf: string) => void;
}

const tenantsPerPage = 7;

export default function TenantList({
  tenants, loading, onCreateAgreement, onRemoveTenant
}: TenantListProps) {
  const [filteredTenants, setFilteredTenants] = useState<Devedor[]>(tenants);
  const [condomiunsList, setCondomiunsList] = useState<string[]>([]);
  const [monthsLateList, setMonthsLateList] = useState<string[]>([]);
  const [condominium, setCondominium] = useState<string>("Todos");
  const [monthsLate, setMonthsLate] = useState<string>("Todos");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Devedor | null>(null);

  const totalPageCount = Math.ceil(filteredTenants.length / tenantsPerPage);

  useEffect(() => {
    // @ts-ignore
    import("preline");
  }, []);

  useEffect(() => {
    const condomiuns = tenants.map((tenant) => tenant.nomeCondominio);
    const uniqueCondomiuns = condomiuns.filter((condominium, index) => {
      return condomiuns.indexOf(condominium) === index;
    });
    const uniqueMonths = getUniqueMonths(tenants.map((x) => x.mensalidadesAtrasadas));

    setCondomiunsList(["Todos", ...uniqueCondomiuns]);
    setMonthsLateList(["Todos", ...uniqueMonths]);
  }, [tenants]);

  useEffect(() => {
    setFilteredTenants(
      tenants
        .filter((tenant) =>
          filterByCodominiumAndMonths(
            condominium,
            tenant.nomeCondominio,
            monthsLate,
            tenant.mensalidadesAtrasadas
          )
        )
        .sort(
          (a, b) =>
            a.nome.localeCompare(b.nome) || a.mensalidadesAtrasadas - b.mensalidadesAtrasadas
        )
    );
  }, [monthsLate, condominium, tenants]);

  function handleSearch(search: string) {
    if (search === "") {
      return setFilteredTenants(tenants);
    }
    const searchLower = search.toLowerCase();

    setFilteredTenants(
      tenants.filter((tenant) => {
        return (
          tenant.nome.toLowerCase().includes(searchLower) ||
          tenant.nomeCondominio.toLowerCase().includes(searchLower) ||
          tenant.cpf.includes(searchLower)
        );
      })
    );
    setPage(1);
  }

  function handlePagination() {
    return filteredTenants.slice((page - 1) * tenantsPerPage, page * tenantsPerPage);
  }

  function handleFilterChange(title: string, option: string) {
    if (title === "Condomínio") {
      setCondominium(option);
    } else {
      setMonthsLate(option);
    }
    setPage(1);
  }

  function openModal(tenant: Devedor) {
    setSelectedDebtor(tenant);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3">
      <div className="flex flex-wrap w-full gap-4 md:gap-8 mb-6 md:flex-nowrap">
        <Search onSearch={handleSearch} />
        <div className="flex justify-end items-center w-fit gap-5">
          <span className="whitespace-nowrap text-sm font-light">Filtrar por:</span>
          <Dropdown title="Condomínio" options={condomiunsList} onChange={handleFilterChange} />
          <Dropdown title="Dívida relativa" options={monthsLateList} onChange={handleFilterChange} />
        </div>
      </div>
      {loading ? (
        <LoadingBar />
      ) : filteredTenants.length === 0 ? (
        "Sem nenhum devedor registrado. Clique em Adicionar ou Importar para adicionar"
      ) : (
        handlePagination().map((tenant) => (
          <DebtorCard key={tenant.cpf} openModal={openModal}
                      tenant={tenant} onRemove={onRemoveTenant}/>
        ))
      )}
      <Paginator
        currentPage={page}
        onPageChange={setPage}
        pageLimit={totalPageCount}
        uniqueKey="pag"
      />
      <TenantModal
        open={modalOpen}
        onClose={closeModal}
        debtor={selectedDebtor!}
        onConfirm={onCreateAgreement}
      />
    </div>
  );
}
