import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsOfService = () => {
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
            <h1 className="text-3xl font-bold mb-6">Regulamin Serwisu VibeOn™</h1>
            
            <div className="space-y-6 text-sm leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Postanowienia Ogólne</h2>
                <p className="mb-2">
                  1.1. Niniejszy Regulamin określa zasady korzystania z aplikacji VibeOn™ (zwanej dalej „Aplikacją" lub „Serwisem").
                </p>
                <p className="mb-2">
                  1.2. Właścicielem i operatorem Aplikacji jest firma Vibe z siedzibą w Polsce (zwana dalej „Operatorem").
                </p>
                <p className="mb-2">
                  1.3. Kontakt z Operatorem możliwy jest za pośrednictwem adresu e-mail: malinkafh@gmail.com
                </p>
                <p>
                  1.4. Korzystanie z Aplikacji jest równoznaczne z akceptacją niniejszego Regulaminu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Definicje</h2>
                <p className="mb-2">
                  2.1. <strong>Użytkownik</strong> – osoba korzystająca z Aplikacji, w szczególności Rodzic lub Dziecko.
                </p>
                <p className="mb-2">
                  2.2. <strong>Rodzic</strong> – pełnoletnia osoba posiadająca pełną zdolność do czynności prawnych, która zakłada konto w Aplikacji i zarządza kontami Dzieci.
                </p>
                <p className="mb-2">
                  2.3. <strong>Dziecko</strong> – niepełnoletni Użytkownik korzystający z Aplikacji za zgodą i pod nadzorem Rodzica.
                </p>
                <p>
                  2.4. <strong>Treści</strong> – materiały audio i wideo dostępne za pośrednictwem Aplikacji, w szczególności pochodzące z platformy YouTube.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Warunki Korzystania z Aplikacji</h2>
                <p className="mb-2">
                  3.1. Aplikacja jest przeznaczona dla dzieci pod nadzorem rodziców lub opiekunów prawnych.
                </p>
                <p className="mb-2">
                  3.2. Rodzic zobowiązany jest do:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Utworzenia bezpiecznego konta dla Dziecka</li>
                  <li>Monitorowania aktywności Dziecka w Aplikacji</li>
                  <li>Ustawienia odpowiednich limitów czasowych</li>
                  <li>Zarządzania treściami blokowanymi</li>
                  <li>Zapewnienia, że Dziecko korzysta z Aplikacji zgodnie z Regulaminem</li>
                </ul>
                <p className="mb-2">
                  3.3. Rodzic ponosi pełną odpowiedzialność za sposób korzystania z Aplikacji przez Dziecko.
                </p>
                <p>
                  3.4. Operator zastrzega sobie prawo do odmowy świadczenia usług w przypadku naruszenia Regulaminu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Rejestracja i Konto</h2>
                <p className="mb-2">
                  4.1. Do korzystania z pełnej funkcjonalności Aplikacji wymagane jest utworzenie konta Rodzica.
                </p>
                <p className="mb-2">
                  4.2. Rodzic zobowiązany jest do podania prawdziwych danych podczas rejestracji.
                </p>
                <p className="mb-2">
                  4.3. Rodzic jest odpowiedzialny za zachowanie poufności danych dostępowych do konta.
                </p>
                <p className="mb-2">
                  4.4. Konto Dziecka może być utworzone wyłącznie przez Rodzica.
                </p>
                <p>
                  4.5. Zabronione jest udostępnianie konta osobom trzecim.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Funkcje Kontroli Rodzicielskiej</h2>
                <p className="mb-2">
                  5.1. Aplikacja oferuje następujące funkcje kontroli rodzicielskiej:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Ustawienie dziennych limitów czasowych</li>
                  <li>Blokowanie określonych treści i fraz</li>
                  <li>Przeglądanie historii odtwarzania</li>
                  <li>Zarządzanie kontami dzieci</li>
                  <li>Personalizacja interfejsu</li>
                </ul>
                <p>
                  5.2. Operator nie gwarantuje, że wszystkie nieodpowiednie treści zostaną automatycznie zablokowane. Rodzic ponosi odpowiedzialność za aktywne korzystanie z funkcji kontroli rodzicielskiej.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Treści</h2>
                <p className="mb-2">
                  6.1. Aplikacja umożliwia dostęp do treści udostępnianych przez platformę YouTube.
                </p>
                <p className="mb-2">
                  6.2. Operator nie jest właścicielem ani twórcą treści dostępnych za pośrednictwem Aplikacji.
                </p>
                <p className="mb-2">
                  6.3. Operator nie ponosi odpowiedzialności za treść materiałów dostępnych za pośrednictwem platformy YouTube.
                </p>
                <p>
                  6.4. Wszelkie prawa autorskie do treści przysługują ich właścicielom.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Zakazy</h2>
                <p className="mb-2">
                  7.1. Zabronione jest:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Wykorzystywanie Aplikacji w sposób sprzeczny z prawem</li>
                  <li>Naruszanie praw osób trzecich</li>
                  <li>Podejmowanie prób ingerencji w działanie Aplikacji</li>
                  <li>Wykorzystywanie luk w zabezpieczeniach</li>
                  <li>Rozpowszechnianie złośliwego oprogramowania</li>
                  <li>Kopiowanie, modyfikowanie lub dekompilowanie Aplikacji</li>
                </ul>
                <p>
                  7.2. Naruszenie powyższych zakazów może skutkować zablokowaniem dostępu do Aplikacji oraz podjęciem kroków prawnych.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Odpowiedzialność</h2>
                <p className="mb-2">
                  8.1. Aplikacja jest świadczona w stanie „jak jest" (as is).
                </p>
                <p className="mb-2">
                  8.2. Operator nie ponosi odpowiedzialności za:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Treści dostępne za pośrednictwem platform zewnętrznych</li>
                  <li>Przerwy w dostępie do Aplikacji spowodowane czynnikami niezależnymi od Operatora</li>
                  <li>Szkody wynikające z niewłaściwego korzystania z Aplikacji</li>
                  <li>Szkody spowodowane brakiem nadzoru Rodzica nad Dzieckiem</li>
                </ul>
                <p>
                  8.3. Rodzic ponosi pełną odpowiedzialność za działania Dziecka w Aplikacji.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Ochrona Danych Osobowych</h2>
                <p className="mb-2">
                  9.1. Zasady przetwarzania danych osobowych określa odrębna Polityka Prywatności.
                </p>
                <p className="mb-2">
                  9.2. Operator przetwarza dane osobowe zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) oraz ustawą o ochronie danych osobowych.
                </p>
                <p>
                  9.3. Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się w Polityce Prywatności.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Płatności i Subskrypcje</h2>
                <p className="mb-2">
                  10.1. Podstawowa wersja Aplikacji jest dostępna bezpłatnie.
                </p>
                <p className="mb-2">
                  10.2. Operator zastrzega sobie prawo do wprowadzenia płatnych funkcji premium w przyszłości.
                </p>
                <p>
                  10.3. Wszelkie warunki płatności i subskrypcji będą komunikowane z odpowiednim wyprzedzeniem.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Zmiany Regulaminu</h2>
                <p className="mb-2">
                  11.1. Operator zastrzega sobie prawo do zmiany Regulaminu.
                </p>
                <p className="mb-2">
                  11.2. Informacja o zmianach zostanie opublikowana w Aplikacji z co najmniej 7-dniowym wyprzedzeniem.
                </p>
                <p>
                  11.3. Kontynuowanie korzystania z Aplikacji po wejściu w życie zmian jest równoznaczne z akceptacją nowego Regulaminu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Rozwiązanie Umowy i Usunięcie Konta</h2>
                <p className="mb-2">
                  12.1. Rodzic może w każdej chwili usunąć swoje konto oraz konta swoich dzieci.
                </p>
                <p className="mb-2">
                  12.2. Operator może rozwiązać umowę i usunąć konto w przypadku naruszenia Regulaminu.
                </p>
                <p>
                  12.3. Usunięcie konta powoduje trwałe usunięcie wszystkich danych związanych z kontem, z wyjątkiem danych, których przechowywanie jest wymagane prawem.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">13. Prawo Odstąpienia od Umowy</h2>
                <p className="mb-2">
                  13.1. Konsument ma prawo odstąpić od umowy bez podania przyczyny w terminie 14 dni od dnia zawarcia umowy.
                </p>
                <p className="mb-2">
                  13.2. Prawo odstąpienia nie ma zastosowania w przypadku korzystania z bezpłatnych usług Aplikacji.
                </p>
                <p>
                  13.3. W przypadku płatnych usług, szczegółowe warunki odstąpienia zostaną określone w odrębnych dokumentach.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">14. Reklamacje</h2>
                <p className="mb-2">
                  14.1. Reklamacje dotyczące działania Aplikacji można składać na adres: malinkafh@gmail.com
                </p>
                <p className="mb-2">
                  14.2. Reklamacja powinna zawierać:
                </p>
                <ul className="list-disc ml-6 mb-2">
                  <li>Dane kontaktowe Użytkownika</li>
                  <li>Opis problemu</li>
                  <li>Oczekiwania Użytkownika</li>
                </ul>
                <p>
                  14.3. Operator rozpatrzy reklamację w ciągu 30 dni od jej otrzymania.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">15. Pozasądowe Rozwiązywanie Sporów</h2>
                <p className="mb-2">
                  15.1. Konsument ma prawo skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń.
                </p>
                <p className="mb-2">
                  15.2. Szczegółowe informacje dotyczące możliwości skorzystania przez konsumenta z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń oraz zasady dostępu do tych procedur dostępne są na stronie internetowej Urzędu Ochrony Konkurencji i Konsumentów: www.uokik.gov.pl
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">16. Prawo Właściwe i Jurysdykcja</h2>
                <p className="mb-2">
                  16.1. W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie przepisy prawa polskiego.
                </p>
                <p>
                  16.2. Wszelkie spory wynikające z korzystania z Aplikacji będą rozstrzygane przez właściwy sąd polski.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">17. Postanowienia Końcowe</h2>
                <p className="mb-2">
                  17.1. Regulamin wchodzi w życie z dniem publikacji w Aplikacji.
                </p>
                <p className="mb-2">
                  17.2. W przypadku sprzeczności między poszczególnymi postanowieniami Regulaminu, pierwszeństwo mają przepisy szczególne przed ogólnymi.
                </p>
                <p>
                  17.3. Jeżeli którekolwiek postanowienie Regulaminu zostanie uznane za nieważne, pozostałe postanowienia pozostają w mocy.
                </p>
              </section>

              <section className="mt-8 pt-6 border-t">
                <p className="font-semibold">Data ostatniej aktualizacji: 4 stycznia 2025</p>
                <p className="mt-2">
                  Operator: Vibe<br />
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

export default TermsOfService;
