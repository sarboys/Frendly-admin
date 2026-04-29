import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdminApiError } from "../api/client";
import {
  archiveRouteTemplate,
  getRouteTemplate,
  listOffers,
  listVenues,
  publishRouteTemplate,
  saveRouteRevision,
} from "../evening/api";
import { RouteEditor } from "../evening/components/RouteEditor";
import { RoutePublishPanel } from "../evening/components/RoutePublishPanel";
import type {
  AdminEveningRouteTemplateDto,
  PartnerOfferDto,
  RouteRevisionInput,
  VenueDto,
} from "../evening/types";
import { AdminTopbar } from "../components/Topbar";

export const AdminEveningRouteDetail = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<AdminEveningRouteTemplateDto | null>(null);
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [offers, setOffers] = useState<PartnerOfferDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!templateId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [templateResponse, venueResponse, offerResponse] = await Promise.all([
        getRouteTemplate(templateId),
        listVenues({ limit: 50 }),
        listOffers({ limit: 50 }),
      ]);
      setTemplate(templateResponse);
      setVenues(venueResponse.items);
      setOffers(offerResponse.items);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [templateId]);

  const saveRevision = async (input: RouteRevisionInput) => {
    if (!templateId) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const next = await saveRouteRevision(templateId, input);
      setTemplate(next);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  const publish = async () => {
    if (!templateId) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      setTemplate(await publishRouteTemplate(templateId));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  const archive = async () => {
    if (!templateId) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      setTemplate(await archiveRouteTemplate(templateId));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Редактор маршрута"
        subtitle={template?.currentRoute?.title ?? (templateId ? `Шаблон ${templateId}` : "Шаблон")}
      />
      <div className="flex justify-end px-5 pt-5 lg:px-8">
        <Button type="button" variant="outline" size="sm" onClick={() => navigate("/evening-routes?ai=1")}>
          <Sparkles className="mr-2 h-4 w-4" />
          AI маршрут
        </Button>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-5 text-[13px] text-muted-foreground">
            Загрузка Route Studio...
          </div>
        ) : template ? (
          <>
            <RouteEditor
              template={template}
              venues={venues}
              offers={offers}
              onSave={saveRevision}
              error={error}
              isSaving={isSaving}
            />
            <RoutePublishPanel
              template={template}
              onPublish={publish}
              onArchive={archive}
              isSaving={isSaving}
              error={error}
            />
          </>
        ) : (
          <div className="rounded-lg border border-border bg-card p-5 text-[13px] text-destructive">
            {error ?? "Маршрут не найден"}
          </div>
        )}
      </div>
    </>
  );
};

function errorMessage(caught: unknown) {
  if (caught instanceof AdminApiError) {
    return `${caught.code}: ${caught.message}`;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось выполнить запрос";
}
