import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót
        </Button>

        <Card className="p-8">
          <ScrollArea className="h-[70vh] pr-4">
            <h1 className="text-3xl font-bold mb-6">Polityka Prywatności VibeOn™</h1>
            
            <div className="space-y-6 text-sm leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Postanowienia Ogólne</h2>
                <p className="mb-2">
                  1.1. Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z aplikacji VibeOn™.
                </p>
                <p className="mb-2">
                  1.2. Administratorem danych osobowych jest firma Vibe z siedzibą w Polsce (zwana dalej „Administratorem").
                </p>
                <p className="mb-2">
                  1.3. Kontakt z Administratorem możliwy jest pod adresem e-mail: malinkafh@gmail.com
                </p>
                <p>
                  1.4. Administrator przetwarza dane osobowe zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) – dalej „RODO".
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Rodzaj Przetwarzanych Danych</h2>
                <p className="mb-2">
                  2.1. Administrator może przetwarzać następujące kategorie danych osobowych:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>Dane konta rodzica:</strong> adres e-mail, hasło (w formie zaszyfrowanej), kod rodzica</li>
                  <li><strong>Dane konta dziecka:</strong> nazwa użytkownika (pseudonim), PIN, kolor awatara, preferencje kolorystyczne</li>
                  <li><strong>Dane dotyczące korzystania z Aplikacji:</strong> historia wyszukiwania, historia odtwarzania, ulubione treści, czas korzystania z aplikacji</li>
                  <li><strong>Dane techniczne:</strong> adres IP, typ przeglądarki, system operacyjny, identyfikator urządzenia</li>
                  <li><strong>Dane dotyczące blokad:</strong> lista zablokowanych fraz i treści</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Cel i Podstawa Prawna Przetwarzania Danych</h2>
                <p className="mb-2">
                  3.1. Dane osobowe są przetwarzane w następujących celach:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>Świadczenie usług (art. 6 ust. 1 lit. b RODO):</strong> utworzenie i zarządzanie kontem, umożliwienie dostępu do funkcjonalności Aplikacji, personalizacja doświadczenia użytkownika</li>
                  <li><strong>Realizacja obowiązków prawnych (art. 6 ust. 1 lit. c RODO):</strong> przechowywanie danych dla celów rachunkowych i podatkowych</li>
                  <li><strong>Prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO):</strong> zapewnienie bezpieczeństwa Aplikacji, dochodzenie roszczeń, analiza statystyczna i ulepszanie usług</li>
                  <li><strong>Zgoda (art. 6 ust. 1 lit. a RODO):</strong> marketing bezpośredni (w przypadku uzyskania zgody)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Ochrona Danych Dzieci</h2>
                <p className="mb-2">
                  4.1. Aplikacja jest przeznaczona dla dzieci korzystających pod nadzorem rodziców lub opiekunów prawnych.
                </p>
                <p className="mb-2">
                  4.2. Administrator nie zbiera świadomie danych osobowych bezpośrednio od dzieci poniżej 16. roku życia bez zgody rodzica.
                </p>
                <p className="mb-2">
                  4.3. Konta dzieci są tworzone wyłącznie przez rodziców i nie wymagają podania rzeczywistego imienia i nazwiska dziecka.
                </p>
                <p className="mb-2">
                  4.4. Rodzic ma pełną kontrolę nad danymi dziecka i może w każdej chwili je usunąć.
                </p>
                <p>
                  4.5. Administrator stosuje dodatkowe środki ochrony danych dzieci, w tym:
                </p>
                <ul className="list-disc ml-6">
                  <li>Minimalizację zbieranych danych</li>
                  <li>Kontrolę rodzicielską nad historią aktywności</li>
                  <li>Brak możliwości komunikacji z innymi użytkownikami</li>
                  <li>Funkcje blokowania nieodpowiednich treści</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Odbiorcy Danych</h2>
                <p className="mb-2">
                  5.1. Dane osobowe mogą być udostępniane następującym kategoriom odbiorców:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>Dostawcy usług technicznych:</strong> hosting, bazy danych, usługi chmurowe (Supabase)</li>
                  <li><strong>YouTube/Google:</strong> w zakresie niezbędnym do wyszukiwania i odtwarzania treści (zgodnie z polityką prywatności YouTube)</li>
                  <li><strong>Dostawcy usług analitycznych:</strong> w celu analizy ruchu i ulepszania Aplikacji</li>
                  <li><strong>Organy państwowe:</strong> w przypadkach przewidzianych prawem</li>
                </ul>
                <p>
                  5.2. Administrator wymaga od wszystkich odbiorców danych zapewnienia odpowiedniego poziomu ochrony danych osobowych.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Przekazywanie Danych Poza EOG</h2>
                <p className="mb-2">
                  6.1. Dane osobowe mogą być przekazywane do państw trzecich (poza Europejski Obszar Gospodarczy) w następujących przypadkach:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Korzystanie z usług YouTube/Google (USA) – na podstawie standardowych klauzul umownych zatwierdzone przez Komisję Europejską</li>
                  <li>Korzystanie z usług hostingowych – na podstawie odpowiednich zabezpieczeń prawnych</li>
                </ul>
                <p>
                  6.2. Administrator zapewnia, że przekazywanie danych poza EOG odbywa się z zachowaniem wszystkich wymaganych zabezpieczeń przewidzianych przez RODO.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Okres Przechowywania Danych</h2>
                <p className="mb-2">
                  7.1. Dane osobowe są przechowywane przez okres:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>Dane konta:</strong> do momentu usunięcia konta przez Użytkownika lub zakończenia świadczenia usług</li>
                  <li><strong>Historia aktywności:</strong> do momentu usunięcia przez Rodzica lub usunięcia konta</li>
                  <li><strong>Dane techniczne i logi:</strong> maksymalnie 12 miesięcy</li>
                  <li><strong>Dane rachunkowe:</strong> zgodnie z przepisami prawa podatkowego (5 lat)</li>
                  <li><strong>Dane dotyczące roszczeń:</strong> przez okres przedawnienia roszczeń</li>
                </ul>
                <p>
                  7.2. Po upływie okresu przechowywania dane są usuwane lub anonimizowane.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Prawa Użytkowników</h2>
                <p className="mb-2">
                  8.1. Każdy Użytkownik ma prawo do:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>Dostępu do danych (art. 15 RODO):</strong> uzyskania informacji o przetwarzanych danych oraz kopii danych</li>
                  <li><strong>Sprostowania danych (art. 16 RODO):</strong> poprawiania nieprawidłowych lub niekompletnych danych</li>
                  <li><strong>Usunięcia danych (art. 17 RODO - "prawo do bycia zapomnianym"):</strong> żądania usunięcia danych w określonych przypadkach</li>
                  <li><strong>Ograniczenia przetwarzania (art. 18 RODO):</strong> żądania ograniczenia przetwarzania danych w określonych sytuacjach</li>
                  <li><strong>Przenoszenia danych (art. 20 RODO):</strong> otrzymania danych w ustrukturyzowanym formacie i przekazania ich innemu administratorowi</li>
                  <li><strong>Sprzeciwu (art. 21 RODO):</strong> wniesienia sprzeciwu wobec przetwarzania danych</li>
                  <li><strong>Cofnięcia zgody:</strong> w przypadkach gdy przetwarzanie odbywa się na podstawie zgody</li>
                </ul>
                <p className="mb-2">
                  8.2. W celu realizacji powyższych praw należy skontaktować się z Administratorem pod adresem: malinkafh@gmail.com
                </p>
                <p>
                  8.3. Użytkownik ma prawo wniesienia skargi do organu nadzorczego (Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Bezpieczeństwo Danych</h2>
                <p className="mb-2">
                  9.1. Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych osobowych, w tym:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Szyfrowanie transmisji danych (SSL/TLS)</li>
                  <li>Szyfrowanie haseł</li>
                  <li>Zabezpieczenia serwerów i baz danych</li>
                  <li>Kontrolę dostępu do danych</li>
                  <li>Regularne tworzenie kopii zapasowych</li>
                  <li>Monitoring bezpieczeństwa systemu</li>
                  <li>Procedury reagowania na incydenty bezpieczeństwa</li>
                </ul>
                <p>
                  9.2. Administrator regularnie dokonuje przeglądu i aktualizacji środków bezpieczeństwa.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Pliki Cookie i Technologie Śledzące</h2>
                <p className="mb-2">
                  10.1. Aplikacja wykorzystuje pliki cookie i podobne technologie w celu:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Zapewnienia prawidłowego działania Aplikacji</li>
                  <li>Zapamiętywania preferencji użytkownika</li>
                  <li>Utrzymania sesji zalogowanego użytkownika</li>
                  <li>Analizy ruchu i statystyk (w przypadku wyrażenia zgody)</li>
                </ul>
                <p className="mb-2">
                  10.2. Rodzaje wykorzystywanych plików cookie:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>Niezbędne:</strong> wymagane do prawidłowego działania Aplikacji</li>
                  <li><strong>Funkcjonalne:</strong> umożliwiają zapamiętanie preferencji użytkownika</li>
                  <li><strong>Analityczne:</strong> służą do analizy sposobu korzystania z Aplikacji (wymagają zgody)</li>
                </ul>
                <p>
                  10.3. Użytkownik może zarządzać plikami cookie poprzez ustawienia przeglądarki. Wyłączenie niektórych plików cookie może wpłynąć na funkcjonalność Aplikacji.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Zautomatyzowane Podejmowanie Decyzji i Profilowanie</h2>
                <p className="mb-2">
                  11.1. Aplikacja nie wykorzystuje zautomatyzowanego podejmowania decyzji, w tym profilowania, które wywołuje skutki prawne lub w podobny sposób istotnie wpływa na Użytkowników.
                </p>
                <p>
                  11.2. Personalizacja treści odbywa się wyłącznie na podstawie historii wyszukiwania i preferencji ustawionych przez Rodzica.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Integracja z Usługami Zewnętrznymi</h2>
                <p className="mb-2">
                  12.1. Aplikacja integruje się z następującymi usługami zewnętrznymi:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li><strong>YouTube API:</strong> do wyszukiwania i odtwarzania treści wideo. Korzystanie z YouTube podlega Polityce Prywatności Google: https://policies.google.com/privacy</li>
                  <li><strong>Supabase:</strong> do przechowywania danych w bazie danych i uwierzytelniania</li>
                </ul>
                <p>
                  12.2. Administrator nie ponosi odpowiedzialności za praktyki w zakresie prywatności usług zewnętrznych.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Zmiany Polityki Prywatności</h2>
                <p className="mb-2">
                  13.1. Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności.
                </p>
                <p className="mb-2">
                  13.2. O wszelkich zmianach Użytkownicy zostaną poinformowani z co najmniej 7-dniowym wyprzedzeniem poprzez powiadomienie w Aplikacji lub wiadomość e-mail.
                </p>
                <p>
                  13.3. Kontynuowanie korzystania z Aplikacji po wejściu w życie zmian jest równoznaczne z akceptacją zaktualizowanej Polityki Prywatności.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">14. Kontakt w Sprawach Ochrony Danych</h2>
                <p className="mb-2">
                  14.1. W przypadku pytań dotyczących przetwarzania danych osobowych lub realizacji praw, prosimy o kontakt:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>E-mail: malinkafh@gmail.com</li>
                  <li>Temat wiadomości: "Ochrona danych osobowych - VibeOn™"</li>
                </ul>
                <p>
                  14.2. Administrator odpowie na zapytanie w ciągu 30 dni od jego otrzymania.
                </p>
              </section>

              <section className="mt-8 pt-6 border-t">
                <p className="font-semibold">Data ostatniej aktualizacji: 4 stycznia 2025</p>
                <p className="mt-2">
                  Administrator danych: Vibe<br />
                  Kontakt: malinkafh@gmail.com
                </p>
              </section>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
